import {
  Operation,
  Property,
  ExpressionOrString,
  ReferenceExpression,
  DotReferenceExpression,
  Expression,
  ExpressionFunctionOrString,
  CZExpressionFunction,
} from "./czParser";

type CZPropertyValue = ExpressionFunctionOrString;

export class CZReference {
  constructor(private readonly value: ExpressionFunctionOrString) {}

  resolve(objects: CZPropertySet[], key: string) {
    const val = this.value;
    if (typeof val === "string") {
      return objects.filter(i => i.get(key).string === val);
    }
    return objects.filter(i => {
      const resolved = i.resolveExpression(val.expression, true);
      return resolved !== undefined && resolved !== null && resolved !== false;
    });
  }
}

export class CZPropertyItem {
  key: string;

  excludeAll = false;
  include: CZPropertyValue[] = [];
  exclude: CZPropertyValue[] = [];

  constructor(key: string) {
    this.key = key;
  }

  reset() {
    this.excludeAll = true;
    this.include = [];
    this.exclude = [];
  }

  add(...values: CZPropertyValue[]) {
    this.include = [...this.include, ...values];
    if (!this.excludeAll) this.exclude = this.exclude.filter(v => !values.includes(v));
  }

  remove(...values: CZPropertyValue[]) {
    if (!this.excludeAll) this.exclude = [...this.exclude, ...values];
    this.include = this.include.filter(v => !values.includes(v));
  }

  get strings() {
    return this.include.map(i => {
      if (typeof i === "object" && i.type === "expression_function")
        throw new Error(`${this.key} has item of type expression_function, should be string`);
      return i as string;
    });
  }

  get requiredStrings() {
    if (this.strings.length === 0) throw new Error(`Required strings not found for ${this.key}`);

    return this.strings;
  }

  get string() {
    if (typeof this.include[0] === "object" && this.include[0].type === "expression_function")
      throw new Error(`${this.key} is of type expression_function, should be string`);
    return this.include[0] as string;
  }

  get requiredString() {
    if (this.string === undefined) throw new Error(`Required string not found for ${this.key}`);

    return this.string!;
  }

  get number() {
    return this.string === undefined ? undefined : Number(this.string);
  }

  get numbers() {
    return this.strings
      .map(string => (string === undefined ? undefined : Number(string)))
      .filter(i => i !== undefined) as number[];
  }

  get requiredNumber() {
    if (this.number === undefined) throw new Error(`Required number not found for ${this.key}`);

    return this.number!;
  }

  get requiredNumbers() {
    if (this.numbers.length === 0) throw new Error(`Required numbers not found for ${this.key}`);

    return this.numbers;
  }

  get references() {
    return this.include.map(i => new CZReference(i));
  }
}

export class CZPropertySet {
  private propertiesMap = new Map<string, CZPropertyItem>();

  get properties() {
    return [...this.propertiesMap.values()];
  }

  constructor(
    properties: Property[] | CZPropertyItem[],
    mergeFrom?: CZPropertySet,
    index = 0,
    usedProperties = new Set<CZPropertyItem>()
  ) {
    this.usedProperties = usedProperties;

    if (properties[0] instanceof CZPropertyItem) {
      for (const property of properties) {
        this.propertiesMap.set(property.key, property as CZPropertyItem);
      }
      return;
    }

    this.mergeFrom = mergeFrom;
    this.unusedProperties = new Set(mergeFrom?.properties);
    this.index = index;

    for (const property of usedProperties) {
      this.unusedProperties.delete(property);
    }

    for (const property of properties) {
      this.addProperty(property as Property);
    }
  }

  private mergeFrom?: CZPropertySet;
  private readonly unusedProperties!: Set<CZPropertyItem>;
  public readonly usedProperties: Set<CZPropertyItem>;

  private used(property: CZPropertyItem) {
    this.usedProperties.add(property);
    this.unusedProperties.delete(property);
  }

  private readonly index: number = 0;

  private getMergeFromProperty(
    ref: ReferenceExpression | DotReferenceExpression,
    resolveWithSelf: boolean
  ) {
    if (ref.type === "dot_reference") {
      if (ref.value === "index") {
        const property = new CZPropertyItem("index");
        property.add(this.index.toString());
        return property;
      }
      if (resolveWithSelf) return this.getProperty("." + ref.value);
      return this.mergeFrom?.getProperty("." + ref.value);
    }
    if (resolveWithSelf) return this.getProperty(ref.value);
    return this.mergeFrom?.getProperty(ref.value);
  }

  private resolveNumericExpression(
    expression: Expression,
    resolveWithSelf: boolean
  ): number | undefined {
    const resolved = this.resolveExpression(expression, resolveWithSelf);
    if (resolved === undefined) return undefined;
    return Number(resolved);
  }

  private resolveArrayExpression(
    expression: Expression,
    resolveWithSelf: boolean
  ): (string | boolean | undefined)[] | string | boolean | undefined {
    if (expression.type === "reference" || expression.type === "dot_reference") {
      const property = this.getMergeFromProperty(expression, resolveWithSelf);
      if (property) this.used(property);
      return property?.strings;
    }
    return this.resolveExpression(expression, resolveWithSelf);
  }

  public resolveExpression(
    expression: Expression,
    resolveWithSelf: boolean
  ): string | boolean | undefined {
    if (expression.type === "reference" || expression.type === "dot_reference") {
      const property = this.getMergeFromProperty(expression, resolveWithSelf);
      if (property) this.used(property);
      return property?.string;
    }
    if (expression.type === "number") {
      return expression.value;
    }
    if (expression.type === "string") {
      return expression.value;
    }
    if (expression.type === "calculation") {
      switch (expression.operator) {
        case "+":
          return (
            this.resolveNumericExpression(expression.left, resolveWithSelf)! +
            this.resolveNumericExpression(expression.right, resolveWithSelf)!
          ).toString();
        case "-":
          return (
            this.resolveNumericExpression(expression.left, resolveWithSelf)! -
            this.resolveNumericExpression(expression.right, resolveWithSelf)!
          ).toString();
        case "*":
          return (
            this.resolveNumericExpression(expression.left, resolveWithSelf)! *
            this.resolveNumericExpression(expression.right, resolveWithSelf)!
          ).toString();
        case "/":
          return (
            this.resolveNumericExpression(expression.left, resolveWithSelf)! /
            this.resolveNumericExpression(expression.right, resolveWithSelf)!
          ).toString();
      }
    }
    if (expression.type === "or") {
      return (
        this.resolveExpression(expression.left, resolveWithSelf) ||
        this.resolveExpression(expression.right, resolveWithSelf)
      );
    }
    if (expression.type === "and") {
      return (
        this.resolveExpression(expression.left, resolveWithSelf) &&
        this.resolveExpression(expression.right, resolveWithSelf)
      );
    }
    if (expression.type === "comparison") {
      const left = this.resolveArrayExpression(expression.left, resolveWithSelf);
      if (typeof left === "object") {
        return left.includes(this.resolveExpression(expression.right, resolveWithSelf));
      }
      return left === this.resolveExpression(expression.right, resolveWithSelf);
    }

    // @ts-expect-error Throw in case of unknown expression type
    throw new Error(`Unsupported expression type ${expression.type}`);
  }

  private resolveValuesAndApply(
    key: string,
    values: (
      | ExpressionOrString[]
      | CZExpressionFunction
      | DotReferenceExpression
      | ReferenceExpression
    )[],
    inverse: boolean
  ) {
    for (const value of values) {
      if ("type" in value && value.type === "expression_function") {
        this.getProperty(key)[inverse ? "remove" : "add"](value);
        return;
      }
      if (!("length" in value)) {
        const property = this.getMergeFromProperty(value, false);
        if (!property) {
          throw new Error(`Property ${value} not found`);
        }
        this.used(property);
        if (!inverse && property.excludeAll) this.getProperty(key).reset();
        this.getProperty(key)[inverse ? "add" : "remove"](...property.exclude);
        this.getProperty(key)[inverse ? "remove" : "add"](...property.include);
        return;
      }
      const resolvedValue = value
        .map(expression => {
          if (typeof expression === "string") {
            return expression;
          }
          return this.resolveExpression(expression, false);
        })
        .join("");
      this.getProperty(key)[inverse ? "remove" : "add"](resolvedValue);
    }
  }

  private addProperty(property: Property) {
    if (property.key === "...rest") {
      if ((property.value[0] as string[])[0] === "true") {
        for (const unusedProperty of this.unusedProperties) {
          if (unusedProperty.key.startsWith(".")) continue;
          if (unusedProperty.excludeAll) this.getProperty(unusedProperty.key).reset();
          this.getProperty(unusedProperty.key).remove(...unusedProperty.exclude);
          this.getProperty(unusedProperty.key).add(...unusedProperty.include);
        }
      }
      return;
    }

    if (property.operation === Operation.Equals) {
      this.getProperty(property.key).reset();
      this.resolveValuesAndApply(property.key, property.value, false);
    } else if (property.operation === Operation.Plus) {
      this.resolveValuesAndApply(property.key, property.value, false);
    } else if (property.operation === Operation.Minus) {
      this.resolveValuesAndApply(property.key, property.value, true);
    }
  }

  private getProperty(key: string) {
    if (!this.propertiesMap.has(key)) {
      this.propertiesMap.set(key, new CZPropertyItem(key));
    }
    return this.propertiesMap.get(key)!;
  }

  get(id: string) {
    return this.getProperty(id);
  }
}
