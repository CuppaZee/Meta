import nearley from "nearley";
import grammar from "./grammar";
import fs from "node:fs";
import { Database } from "./database";
import { ScatterType, Type, TypeHidden, TypeState, TypeTags } from "./items/type";
import { Group } from "./items/group";
import { CZPropertyItem, CZPropertySet } from "./czProperties";
import { checkType } from "./build";

type BuilderItem = {
  item: "builder";
  type: string;
  properties: Property[];
  for?: For[];
  if?: Expression;
};

type TemplateItem = {
  item: "template";
  type: string;
  // TODO: Handle explicit parameters
  params: string[];
  items: BuilderItem[];
  scope?: string;
};

type Item = BuilderItem | TemplateItem;

interface For {
  values: (ExpressionOrString[] | DotReferenceExpression | ReferenceExpression)[];
  properties?: Property[];
}

export enum Operation {
  Equals = "=",
  Plus = "+",
  Minus = "-",
}

export interface Property {
  key: string;
  value: (
    | ExpressionOrString[]
    | CZExpressionFunction
    | DotReferenceExpression
    | ReferenceExpression
  )[];
  operation: Operation;
}

export interface OrExpression {
  type: "or";
  left: Expression;
  right: Expression;
}

export interface AndExpression {
  type: "and";
  left: Expression;
  right: Expression;
}

export interface ComparisonExpression {
  type: "comparison";
  left: Expression;
  right: Expression;
}

export interface CalculationExpression {
  type: "calculation";
  operator: "*" | "/" | "+" | "-";
  left: Expression;
  right: Expression;
}

export interface NumberExpression {
  type: "number";
  value: string;
}

export interface StringExpression {
  type: "string";
  value: string;
}

export interface ReferenceExpression {
  type: "reference";
  value: string;
}

export interface DotReferenceExpression {
  type: "dot_reference";
  value: string;
}

export type Expression =
  | OrExpression
  | AndExpression
  | ComparisonExpression
  | CalculationExpression
  | NumberExpression
  | StringExpression
  | ReferenceExpression
  | DotReferenceExpression;

export interface CZExpressionFunction {
  type: "expression_function";
  expression: Expression;
}

export type ExpressionFunctionOrString = CZExpressionFunction | string;

export type ExpressionOrString = Expression | string;

abstract class CZScope {
  protected abstract ancestors: CZScope[];
  protected abstract rootScope: CZScope;

  templates = new Map<string, TemplateItem>();

  get allTemplates(): Map<string, TemplateItem> {
    const templates = new Map<string, TemplateItem>();
    for (const scope of [this, ...this.ancestors]) {
      for (const [key, value] of scope.templates) {
        if (!templates.has(key)) templates.set(key, value);
      }
    }
    return templates;
  }
}

class CZFileParser extends CZScope {
  fileName: string;
  private lastGroup: Group | null = null;
  private database: Database;

  ancestors: CZScope[];
  rootScope: CZScope;

  constructor(root: CZParser, fileName: string, database: Database) {
    super();
    this.ancestors = [root];
    this.rootScope = root;
    this.fileName = fileName;
    this.database = database;
  }

  runBaseTemplate(properties: CZPropertySet) {
    const type = new Type(properties.get("name").requiredString, properties.get("id").number);

    if (properties.properties.some(i => i.exclude.length > 0)) {
      throw new Error("Remove found in Base template");
    }
    for (const property of properties.properties) {
      switch (property.key) {
        case "name":
        case "id":
          break;
        case "tags":
          type.setTags(
            property.strings.map(i => {
              const tag = (TypeTags as unknown as Record<string, TypeTags>)[i];
              if (tag === undefined) {
                throw new Error(`Unknown tag ${i}`);
              }
              return tag;
            })
          );
          break;
        case "hidden":
          type.setHidden(
            property.strings.map(i => {
              const hiddenTag = (TypeHidden as unknown as Record<string, TypeHidden>)[i];
              if (hiddenTag === undefined) {
                throw new Error(`Unknown hidden tag ${i}`);
              }
              return hiddenTag;
            })
          );
          break;
        case "state":
          if (property.include.length > 1) {
            throw new Error("Multiple state found in Base template");
          }
          type.setState(
            property.strings.map(i => {
              const stateTag = (TypeState as unknown as Record<string, TypeState>)[i];
              if (stateTag === undefined) {
                throw new Error(`Unknown state tag ${i}`);
              }
              return stateTag;
            })[0]
          );
          break;
        case "groups":
          type.setGroups(property.references);
          break;
        case "standalone":
          ScatterType.prototype.standalone.bind(type)();
          break;
        case "physical":
          type.setState(TypeState.Physical);
          break;
        case "virtual":
          type.setState(TypeState.Virtual);
          break;
        case "icons":
          property.excludeAll ? type.setIcons(property.strings) : type.addIcons(property.strings);
          break;
        case "humanId":
          type.setHumanId(property.requiredString);
          break;
        case "bouncer.lands_on":
          type.setBouncerLandsOn(property.references);
          break;
        case "scatterer.scatters":
          type.scattererScatters(property.references);
          break;
        case "custom:useVirtualIcon":
          type.setIcon(type.name.toLowerCase().replace(/\s/g, "_"));
          break;
        default:
          throw new Error(`Unknown Base property ${property.key}`);
      }
    }
    if (this.lastGroup && type.groups.length === 0) {
      type.addGroup(this.lastGroup);
    }
    this.database.types.add(type);
    checkType(this.fileName, type);
  }

  runGroupTemplate(properties: CZPropertySet) {
    const group = new Group({
      name: properties.get("name").requiredString,
      human_id: properties.get("humanId").string,
    });
    if (properties.properties.some(i => i.exclude.length > 0)) {
      throw new Error("Remove found in Group template");
    }
    for (const property of properties.properties) {
      switch (property.key) {
        case "name":
        case "humanId":
          break;
        case "seasonal.year":
          group.setSeasonalYear(property.requiredNumber);
          break;
        case "seasonal.start":
          group.setSeasonalStart(property.requiredString);
          break;
        case "seasonal.end":
          group.setSeasonalEnd(property.requiredString);
          break;
        case "parents":
          group.setParents(property.references);
          break;
        default:
          throw new Error(`Unknown Group property ${property.key}`);
      }
    }
    this.lastGroup = group;
    this.database.groups.add(group);
  }
}

export class CZParser extends CZScope {
  private grammarInstance = nearley.Grammar.fromCompiled(grammar);

  ancestors: CZScope[];
  rootScope: CZScope;

  builders = new Map<string, BuilderItem[]>();

  private fileParsers = new Map<string, CZFileParser>();

  constructor(files: string[], database: Database) {
    super();
    this.ancestors = [];
    this.rootScope = this;

    for (const file of files) {
      const parser = new nearley.Parser(this.grammarInstance);
      parser.feed(fs.readFileSync(file, "utf8"));
      if (parser.results.length !== 1) {
        if (parser.results.length === 0) {
          throw new Error(`Invalid syntax in file: ${file}`);
        }
        throw new Error(`Invalid syntax in file: ${file} (ambiguous, multiple results)`);
      }
      const items: Item[] = parser.results[0];
      const builderItems: BuilderItem[] = [];

      const fileParser = new CZFileParser(this, file, database);
      this.fileParsers.set(file, fileParser);

      for (const item of items) {
        if (item.item === "builder") {
          builderItems.push(item);
        } else if (item.item === "template") {
          if (item.scope === "global") {
            this.templates.set(item.type, item);
          } else {
            fileParser.templates.set(item.type, item);
          }
        }
      }

      this.builders.set(file, builderItems);
    }
  }

  runFileBuilders(file: string) {
    const builderItems = this.builders.get(file);
    const fileParser = this.fileParsers.get(file);
    if (!builderItems || !fileParser) {
      throw new Error(`CZ File has not been loaded: ${file}`);
    }
    for (const builderItem of builderItems) {
      this.runBuilder(builderItem, fileParser);
    }
  }

  private flattenProperties(
    item: Pick<BuilderItem, "properties" | "for">,
    withProperties?: CZPropertySet
  ) {
    const propertiesList = [];
    let index = 0;
    let usedProperties: Set<CZPropertyItem> | undefined = undefined;

    const forItems: [Property[], CZPropertySet][] = [];

    for (const f of item.for ?? [{ values: [] }]) {
      const used = usedProperties as Set<CZPropertyItem> | undefined;
      const forProperties = new CZPropertySet(
        f.values.map((i, n) => ({
          key: `.${n + 1}`,
          value: [i],
          operation: Operation.Equals,
        })),
        new CZPropertySet(withProperties?.properties ?? []),
        index,
        used
      );
      usedProperties = forProperties.usedProperties;

      forItems.push([
        f.properties ?? [],
        new CZPropertySet([...forProperties.properties, ...(withProperties?.properties ?? [])]),
      ]);
      index++;
    }

    index = 0;

    for (const forItem of forItems) {
      propertiesList.push(
        new CZPropertySet(
          // Base Properties
          [...item.properties, ...forItem[0]],
          // Applied Properties
          forItem[1],
          index,
          usedProperties
        )
      );
      usedProperties = propertiesList[propertiesList.length - 1].usedProperties;
      index++;
    }
    return propertiesList;
  }

  private runBuilder(builderItem: BuilderItem, fileParser: CZFileParser) {
    const propertiesList = this.flattenProperties(builderItem);
    for (const properties of propertiesList) {
      this.runTemplate(builderItem.type, properties, fileParser);
    }
  }

  private runTemplate(templateName: string, properties: CZPropertySet, fileParser: CZFileParser) {
    if (`run${templateName}Template` in fileParser) {
      (fileParser as unknown as Record<string, (properties: CZPropertySet) => void>)[
        `run${templateName}Template`
      ](properties);
      return;
    }
    const template = fileParser.allTemplates.get(templateName);
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }
    for (const item of template.items) {
      const itemPropertiesList = this.flattenProperties(item, properties);
      for (const itemProperties of itemPropertiesList) {
        if (!item.if) {
          this.runTemplate(item.type, itemProperties, fileParser);
        } else {
          const resolvedIf = itemProperties.resolveExpression(item.if, false);
          if (resolvedIf !== undefined && resolvedIf !== null) {
            this.runTemplate(item.type, itemProperties, fileParser);
          }
        }
      }
    }
  }
}
