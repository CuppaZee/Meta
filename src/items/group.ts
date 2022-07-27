import { XMLBuilder } from "xmlbuilder2/lib/interfaces";
import { LegacyAccessory, LegacyCategory } from "./legacy";
import { createHash } from "node:crypto";
import { CZPropertySet, CZReference } from "../czProperties";
import { Operation } from "../czParser";
import chalk from "chalk";
import { Type } from "./type";

export interface GroupOptions {
  name: string;
  human_id?: string;
  icons?: string[];
}

export interface GroupData {
  id: number;
  name: string;
  human_id: string;
  icons: string[];
  seasonal?: GroupSeasonalProperties;
  parents: (number | string)[];
}

export interface GroupSeasonalProperties {
  year: number;
  starts: string;
  ends: string;
}

export interface GroupDetails {
  related?: {
    blog?: string[];
  };
  description?: string;
}

export class Group {
  private static i = 0;
  internal_id: number = Group.i++;

  static ids = new Set<number>();
  static humanIds = new Set<string>();
  file?: string;

  static generateId(human_id: string) {
    if (this.humanIds.has(human_id)) {
      throw new Error(`Duplicate human_id: ${human_id}`);
    }
    this.humanIds.add(human_id);
    for (let i = 0; i < 5; i++) {
      const sha = createHash("sha1");
      sha.update(`${human_id}${i}`);
      const id = parseInt(sha.digest("hex").slice(0, i + 4), 16);
      if (!this.ids.has(id)) {
        this.ids.add(id);
        return id;
      }
    }
    throw new Error(`Could not find a unique ID for ${human_id}`);
  }

  _db!: GroupDatabase;
  id: number;
  icons: string[] = null!;
  name: string;
  human_id: string;
  _parents: (Group | CZReference)[] = [];
  get parents() {
    return this._parents.map(i => {
      if (i instanceof Group) return i;
      throw new Error("References not yet resolved for group");
    }) as Group[];
  }

  seasonal?: GroupSeasonalProperties;
  legacyAccessories: LegacyAccessory[] = [];
  details: GroupDetails = {};

  constructor(options: GroupOptions) {
    this.name = options.name;
    this.human_id = options.human_id?.toString() ?? options.name.replace(/\s+/g, "_").toLowerCase();
    this.id = Group.generateId(this.human_id);
    if (options.icons) this.icons = options.icons;
    this.template();
  }

  addRelatedBlog(...blogs: (string | string[])[]): this {
    this.details.related ??= {};
    this.details.related.blog ??= [];
    this.details.related.blog.push(...blogs.flat());
    return this;
  }

  setRelatedBlog(...blogs: (string | string[])[]): this {
    this.details.related ??= {};
    this.details.related.blog = blogs.flat();
    return this;
  }

  setDescription(description: string): this {
    this.details.description = description;
    return this;
  }

  setParents(parents: (Group | CZReference)[]) {
    this._parents = parents;
    return this;
  }

  addParent(parent: Group) {
    this._parents.push(parent);
    return this;
  }

  setSeasonalStart(date: string): this {
    this.seasonal ??= {
      starts: "",
      ends: "",
      year: 0,
    };
    this.seasonal.starts = date;
    return this;
  }

  setSeasonalEnd(date: string): this {
    this.seasonal ??= {
      starts: "",
      ends: "",
      year: 0,
    };
    this.seasonal.ends = date;
    return this;
  }

  setSeasonalYear(year: number): this {
    this.seasonal ??= {
      starts: "",
      ends: "",
      year: 0,
    };
    this.seasonal.year = year;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  template(): void {}

  toJSON(variant?: "regular"): Omit<GroupData, "details">;
  toJSON(variant: "full"): GroupData;
  toJSON(variant?: "full" | "regular") {
    const data: Omit<GroupData, "details"> = {
      id: this.id,
      human_id: this.human_id,
      icons: this.icons,
      name: this.name,
      seasonal: this.seasonal,
      parents: this.parents.map(i => i.id),
    };
    if (variant === "full") {
      return {
        ...data,
        details: Object.keys(this.details).length > 0 ? this.details : undefined,
      };
    }
    return data;
  }

  toLegacyJSON(): LegacyCategory {
    return {
      name: this.name,
      id: this.human_id,
      icon: this.icons[0],
      seasonal: this.seasonal
        ? {
            year: this.seasonal.year,
            start: new Date(this.seasonal.starts).valueOf(),
            end: new Date(this.seasonal.ends).valueOf(),
          }
        : undefined,
      parents: this.parents.map(i => i.human_id),
      accessories: this.legacyAccessories.length > 0 ? this.legacyAccessories : undefined,
    };
  }

  addToXML(xml: XMLBuilder): void {
    const group = xml.ele("group", { att: "val" });
    group.att("id", this.id.toString());
    group.att("human_id", this.human_id);
    group.ele("name").txt(this.name);
    for (const icon of this.icons) {
      group.ele("icon").txt(icon);
    }
    if (this.seasonal) {
      const seasonal = group.ele("seasonal");
      seasonal.ele("year").txt(this.seasonal.year?.toString());
      seasonal.ele("start").txt(this.seasonal.starts);
      seasonal.ele("end").txt(this.seasonal.ends);
    }
    for (const parent of this.parents) {
      group.ele("parent").txt(parent.id.toString());
    }
  }

  addLegacyAccessories(accessories: (LegacyAccessory | LegacyAccessory[])[]): this {
    this.legacyAccessories.push(...accessories.flat());
    return this;
  }
}

export class GroupDatabase {
  private data: Group[];
  private referencesResolved = false;

  public deref(group: CZReference | Group): Group {
    if (group instanceof Group) return group;
    const g = group
      .resolve(
        this.groups.map(
          group =>
            new CZPropertySet([
              {
                key: "name",
                value: [[group.name]],
                operation: Operation.Equals,
              },
              {
                key: "id",
                value: [[group.id.toString()]],
                operation: Operation.Equals,
              },
            ])
        ),
        "name"
      )
      .map(i => i.get("id").requiredNumbers)
      .flat();
    if (g.length !== 1) throw new Error(`Could not resolve group ${group}`);
    return this.data.find(i => i.id === g[0])!;
  }

  constructor() {
    this.data = [];
  }

  public add(...groups: (Group[] | Group)[]): this {
    const g = groups.flat();
    g.forEach(g => {
      g._db = this;
    });
    this.data.push(...g);
    return this;
  }

  public get(id: number): Group | undefined {
    return this.data.find(group => group.id === id);
  }

  get groups(): Group[] {
    return this.data;
  }

  private resolveReference(
    groupProperties: CZPropertySet[],
    group: Group | Type,
    ref: CZReference | Group | ((v: Group) => boolean)
  ): Group[] {
    if (ref instanceof Group) return [ref];
    if (ref instanceof CZReference) {
      const resolvedRef = ref.resolve(groupProperties, "name");
      return resolvedRef
        .map(i => i.get("id").requiredNumbers)
        .flat()
        .map(i => this.groups.find(g => g.id === i)!);
    }
    const groups = this.groups.filter(ref);
    if (groups.length === 0)
      console.warn(
        chalk.gray`[{yellow WARN}] ${
          group.file
        }: Could not resolve reference ${ref.toString()} for ${group.name}`
      );
    return groups;
  }

  public publicResolveReference(
    group: Group | Type,
    ref: CZReference | Group | ((v: Group) => boolean)
  ) {
    if (ref instanceof Group) return [ref];
    return this.resolveReference(this.getGroupProperties(), group, ref);
  }

  private getGroupProperties() {
    return this.groups.map(
      group =>
        new CZPropertySet([
          {
            key: "name",
            value: [[group.name]],
            operation: Operation.Equals,
          },
          {
            key: "id",
            value: [[group.id.toString()]],
            operation: Operation.Equals,
          },
        ])
    );
  }

  public resolveReferences(): void {
    if (this.referencesResolved) throw new Error("References have already been resolved");
    this.referencesResolved = true;
    const groupProperties: CZPropertySet[] = this.getGroupProperties();
    for (const group of this.groups) {
      group._parents = group._parents
        .map(i => this.resolveReference(groupProperties, group, i))
        .flat();
      delete group.file;
    }
  }
}
