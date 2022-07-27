import { Year2020SeasonalBouncerType, Year2020SeasonalGroup } from "./_index";
import { TypeTags } from "../../../src/items/type";
import { treehouse, skyland } from "../../normal/destination";
import { greenie } from "../../normal/misc";
import { mystery, earthMystery } from "../../normal/mystery";
import { briefcase, nightVisionGoggles } from "../../normal/weapons";
import { ref } from "../../../src/czProperties";

export const zeecretAgentsGroup = new Year2020SeasonalGroup({
  name: "Zeecret Agents",
  starts: "2020-10-08T12:00:00-05:00",
  ends: "2020-11-08T23:59:00-05:00",
});

export const pINEAgent = new Year2020SeasonalBouncerType("PINE Agent", 2616)
  .addGroup(zeecretAgentsGroup)
  .addBouncerLandsOn(
    greenie,
    mystery,
    earthMystery,
    type => type.hasTags(TypeTags.TypeVirtual),
    ref`Self Destruct Card`,
    briefcase,
    nightVisionGoggles,
    treehouse,
    skyland
  );
export const pEARAgent = new Year2020SeasonalBouncerType("PEAR Agent", 2615)
  .addGroup(zeecretAgentsGroup)
  .addBouncerLandsOn(
    greenie,
    mystery,
    earthMystery,
    type => type.hasTags(TypeTags.TypeVirtual),
    ref`Self Destruct Card`,
    briefcase,
    nightVisionGoggles,
    treehouse,
    skyland
  );
export const virtualPineamite = new Year2020SeasonalBouncerType("Virtual Pineamite", 2614)
  .addGroup(zeecretAgentsGroup)
  .addBouncerLandsOn(
    type => type.hasTags(TypeTags.TypeVirtual),
    ref`Self Destruct Card`,
    nightVisionGoggles
  );
export const physicalPineamite = new Year2020SeasonalBouncerType("Physical Pineamite", 2613)
  .addGroup(zeecretAgentsGroup)
  .addBouncerLandsOn(greenie, mystery, earthMystery, briefcase);
export const virtualPearBomb = new Year2020SeasonalBouncerType("Virtual Pear Bomb", 2612)
  .addGroup(zeecretAgentsGroup)
  .addBouncerLandsOn(
    type => type.hasTags(TypeTags.TypeVirtual),
    ref`Self Destruct Card`,
    nightVisionGoggles
  );
export const physicalPearBomb = new Year2020SeasonalBouncerType("Physical Pear Bomb", 2611)
  .addGroup(zeecretAgentsGroup)
  .addBouncerLandsOn(greenie, mystery, earthMystery, briefcase);
