import { TypeSet } from "../../common/type";
import { Year2022SeasonalScatterType, Year2022SeasonalGroup } from "./_index";

export const flatMurrayScattersGroup = new Year2022SeasonalGroup({
  name: "Flat Murray Scatters",
  starts: "2022-06-02T12:00:00-05:00",
  ends: "2022-06-06T23:59:00-05:00",
});

export const flatMurrayScatters = new TypeSet(
  (
    [
      ["Rose Rope", 3756],
      ["Bone Scepter", 3757],
      ["Beach Ball", 3758],
      ["Banana Peel Plush", 3759],
    ] as const
  ).map(([name, id]) =>
    new Year2022SeasonalScatterType(name, id).addGroup(flatMurrayScattersGroup).standalone()
  )
);
