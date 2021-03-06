import { Group } from "../../../src/items/group";
import { TypeTags } from "../../../src/items/type";
import {
  SeasonalBouncerType,
  SeasonalPOBType,
  SeasonalGroup,
  SeasonalScatterType,
  SeasonalType,
  seasonalGroup,
  SeasonalGroupOptions,
} from "../_index";

export const year2021SeasonalGroup = new Group({
  name: "2021 Seasonal Specials",
}).addParent(seasonalGroup);

export class Year2021SeasonalBouncerType extends SeasonalBouncerType {
  override template(): this {
    super.template();
    return this.addTag(TypeTags.BouncerSeasonal2021);
  }
}

export class Year2021SeasonalPOBType extends SeasonalPOBType {
  override template(): this {
    super.template();
    return this.addTag(TypeTags.BouncerSeasonal2021);
  }
}

export class Year2021SeasonalScatterType extends SeasonalScatterType {
  override template(): this {
    super.template();
    return this;
  }
}

export class Year2021SeasonalType extends SeasonalType {
  override template(): this {
    super.template();
    return this;
  }
}

export class Year2021SeasonalGroup extends SeasonalGroup {
  constructor(options: SeasonalGroupOptions) {
    super({ year: 2021, ...options });
  }
  override template(): this {
    super.template();
    return this.addParent(year2021SeasonalGroup);
  }
}
