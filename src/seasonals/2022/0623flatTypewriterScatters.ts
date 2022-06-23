import { TypeSet } from "../../common/type";
import { Year2022SeasonalScatterType, Year2022SeasonalGroup } from "./_index";

export const flatTypewriterScattersGroup = new Year2022SeasonalGroup({
  name: "Flat Typewriter Scatters",
  starts: "2022-06-23T12:00:00-05:00",
  ends: "2022-06-26T23:59:00-05:00",
});

export const flatTypewriterScatters = new TypeSet(
  (
    [["Red Hat"], ["Body of Knowledge"], ["Love is a Crocodile"], ["The Crows Nest"]] as [
      string,
      number?
    ][]
  ).map(([name, id]) =>
    new Year2022SeasonalScatterType(name, id).addGroup(flatTypewriterScattersGroup).standalone()
  )
);
