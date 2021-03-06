import { TypeTags } from "../../../src/items/type";
import { bones, dinosaur, egg, fish, seaweed, shark } from "../../evolutions/education";
import {
  calf,
  cornSeed,
  cornStalk,
  cow,
  earofCorn,
  family,
  farmer,
  farmerandWife,
  milk,
} from "../../evolutions/farm";
import { beeEggs, beeLarvae, beePupae, emptyHoneycomb } from "../../evolutions/nature_bouncers";
import { flatMurray } from "../../normal/flats";
import { surprise, urbanFit } from "../../normal/gaming";
import {
  diamond,
  ruby,
  aquamarine,
  topaz,
  pinkDiamond,
  emerald,
  sapphire,
  amethyst,
  citrine,
  onyx,
} from "../../normal/jewels";
import { greenie, premium, shamrock, virtualShamrock } from "../../normal/misc";
import {
  Year2022SeasonalGroup,
  Year2022SeasonalBouncerType,
  Year2022SeasonalScatterType,
} from "./_index";

export const cerealGroup = new Year2022SeasonalGroup({
  name: "National Cereal Day",
  starts: "2022-03-07T12:00:00-05:00",
  ends: "2022-03-31T23:59:00-05:00",
});

class CerealBowl extends Year2022SeasonalBouncerType {
  constructor(name: string, id?: number) {
    super(name, id);
    this.addGroup(cerealGroup);
  }
}

class CerealScatter extends Year2022SeasonalScatterType {
  constructor(name: string, id?: number) {
    super(name, id);
    this.addGroup(cerealGroup).standalone();
  }
}

export const emptyBlueCerealBowl = new CerealBowl("Empty Blue Cereal Bowl", 3642).addBouncerLandsOn(
  greenie,
  premium,
  shamrock,
  urbanFit,
  // Evolutions
  calf,
  cow,
  milk,
  cornSeed,
  cornStalk,
  earofCorn,
  egg,
  dinosaur,
  bones,
  seaweed,
  fish,
  shark,
  beeEggs,
  beeLarvae,
  beePupae,
  emptyHoneycomb,
  // Jewels
  diamond,
  ruby,
  aquamarine,
  topaz,
  pinkDiamond
);
export const emptyYellowCerealBowl = new CerealBowl(
  "Empty Yellow Cereal Bowl",
  3643
).addBouncerLandsOn(
  type => type.hasTags(TypeTags.TypeVirtual),
  surprise,
  virtualShamrock,
  flatMurray,
  // Evolutions
  farmer,
  farmerandWife,
  family,
  // Jewels
  emerald,
  sapphire,
  citrine,
  onyx,
  amethyst
);

export const greenMilkCarton = new CerealScatter("Green Milk Carton", 3644);
export const pinkMilkCarton = new CerealScatter("Pink Milk Carton", 3645);
export const boneBitesCerealBox = new CerealScatter("Bone Bites Cereal Box", 3646);
export const unicornPuffsCerealBox = new CerealScatter("Unicorn Puffs Cereal Box", 3647);
export const honeycombCrunchCerealBox = new CerealScatter("Honeycomb Crunch Cereal Box", 3648);
export const spearmintBranCerealBox = new CerealScatter("Spearmint Bran Cereal Box", 3649);
export const roverCerealSpoon = new CerealScatter("Rover Cereal Spoon", 3650);
export const unicornCerealSpoon = new CerealScatter("Unicorn Cereal Spoon", 3651);
export const wallabeeCerealSpoon = new CerealScatter("WallaBee Cereal Spoon", 3652);
export const toothbrushCerealSpoon = new CerealScatter("Toothbrush Cereal Spoon", 3653);
