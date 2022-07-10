import { Group } from "../../src/items/group";
import { Type, TypeTags } from "../../src/items/type";
import { normalGroup } from "./_index";

export const FlatGroup = new Group({ name: "Flats" }).addParent(normalGroup);

export class FlatType extends Type {
  override template(): this {
    super.template();
    return this.addGroup(FlatGroup).addTag(TypeTags.TypeFlat).virtual();
  }
}

export const flatRob = new FlatType("Flat Rob", 353);
export const flatMatt = new FlatType("Flat Matt", 1015);
export const flatLou = new FlatType("Flat Lou", 1338);
export const flatHammock = new FlatType("Flat Hammock", 1581);
export const flatDHS = new FlatType("Flat DHS", 2903);
export const flatDiscGolfBasket = new FlatType("Flat Disc Golf Basket", 2904);
export const flatFlashlight = new FlatType("Flat Flashlight", 2905);
export const flatTypewriter = new FlatType("Flat Typewriter", 2906);
export const flatMurray = new FlatType("Flat Murray", 2907);
export const flatRUM = new FlatType("Flat RUM", 2908).addTag(TypeTags.TypeReseller);
export const flatCats = new FlatType("Flat Cats", 2909);
export const flatVan = new FlatType("Flat Van", 2910);
