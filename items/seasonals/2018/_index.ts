import { Group } from "../../../src/items/group";
import { TypeTags } from "../../../src/items/type";
import {
  SeasonalBouncerType,
  seasonalGroup,
  SeasonalGroup,
  SeasonalGroupOptions,
  SeasonalScatterType,
  SeasonalType,
} from "../_index";

export const year2018SeasonalGroup = new Group({
  name: "2018 Seasonal Specials",
}).addParent(seasonalGroup);

export class Year2018SeasonalBouncerType extends SeasonalBouncerType {
  override template(): this {
    super.template();
    return this.addTag(TypeTags.BouncerSeasonal2018);
  }
}

export class Year2018SeasonalScatterType extends SeasonalScatterType {
  override template(): this {
    super.template();
    return this;
  }
}

export class Year2018SeasonalType extends SeasonalType {
  override template(): this {
    super.template();
    return this;
  }
}

export class Year2018SeasonalGroup extends SeasonalGroup {
  constructor(options: SeasonalGroupOptions) {
    super({ year: 2018, ...options });
  }
  override template(): this {
    super.template();
    return this.addParent(year2018SeasonalGroup);
  }
}
