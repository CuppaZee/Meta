import { Group } from "../../src/items/group";
import { ScatterType, Type, TypeSet, TypeTags } from "../../src/items/type";
import { normalGroup } from "./_index";

export const GamingGroup = new Group({ name: "Gaming" }).addParent(normalGroup);

export class GamingType extends Type {
  override template(): this {
    super.template();
    return this.setGroup([GamingGroup]).addTag(TypeTags.TypeGaming);
  }
}

export class GamingScatterType extends ScatterType {
  override template(): this {
    super.template();
    return this.setGroup([GamingGroup]).addTag(TypeTags.TypeGaming);
  }
}

// [Gaming] Misc
export const surprise = new GamingType("Surprise", 400).virtual();
export const prizeWheel = new GamingType("Prize Wheel", 444).physical();
export const rps = new GamingType("Rock Paper Scissors", 522).physical();

export const legacyBowlingScatters = new TypeSet()
  .add(new GamingScatterType("Legacy 1st Roll", 1644).setIcon("1stroll").physical())
  .add(new GamingScatterType("Legacy 2nd Roll", 1645).setIcon("2ndroll").physical());
export const bowlingScatters = new TypeSet()
  .add(new GamingScatterType("1st Roll", 2244).setIcon("bowling-1stroll").standalone())
  .add(new GamingScatterType("2nd Roll", 2245).setIcon("bowling-2ndroll").standalone());
export const bowling = new GamingType("Bowling Ball", 1643)
  .physical()
  .scattererScatters(bowlingScatters);

export const urbanFit = new GamingType("Urban Fit", 1824).physical();
export const sirPrizeWheel = new GamingType("Sir Prize Wheel", 2412).virtual();

// [Gaming] Scatter
export const scattered = new GamingScatterType("Scattered", 501).physical();
export const scatter = new GamingType("Scatter", 500).physical().scattererScatters(scattered);

// [Gaming] Joysticks
export const joystickVirtualScatters = new TypeSet()
  .add(new GamingScatterType("Gold Coin", 2004).standalone())
  .add(new GamingScatterType("Fly", 2006).standalone())
  .add(new GamingScatterType("Ghostzee", 2008).standalone());

export const joystickPhysicalScatters = new TypeSet()
  .add(new GamingScatterType("Runzee Rob", 2003).physical())
  .add(new GamingScatterType("Leap Frog", 2005).physical())
  .add(new GamingScatterType("Munch-Man", 2007).physical())
  .each(i => i.scattererScatters(joystickVirtualScatters));

export const joystickVirtual = new GamingType("Joystick Virtual", 2002)
  .virtual()
  .scattererScatters(joystickPhysicalScatters);
export const joystickPhysical = new GamingType("Joystick Physical", 1976)
  .setIcons("joystick", "joystickphysical")
  .physical()
  .scattererScatters(joystickPhysicalScatters);

// [Gaming] Chess
const chessPieceNames = ["Pawn", "Knight", "Bishop", "Rook", "Queen", "King"];
export const chessPieces = new TypeSet()
  .add(
    chessPieceNames.map((piece, pieceIndex) =>
      new GamingScatterType(`Maple ${piece}`, pieceIndex + 3282).standalone()
    )
  )
  .add(
    chessPieceNames.map((piece, pieceIndex) =>
      new GamingScatterType(`Walnut ${piece}`, pieceIndex + 3275).standalone()
    )
  );
export const mapleChestSet = new GamingType("Maple Chess Set", 3281)
  .virtual()
  .scattererScatters(chessPieces);
export const walnutChestSet = new GamingType("Walnut Chess Set", 3274)
  .physical()
  .scattererScatters(chessPieces);
