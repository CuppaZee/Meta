import { Group } from "../../../src/items/group";
import { BouncerHostType, BouncerType, TypeTags } from "../../../src/items/type";
import { carrotEvos, goldenCarrot } from "../../evolutions/farm";
import { coin } from "../../evolutions/reseller";
import { skyland, treehouse } from "../../normal/destination";
import { amethyst } from "../../normal/jewels";
import { greenie, shamrock } from "../../normal/misc";
import {
  airMystery,
  earthMystery,
  fireMystery,
  iceMystery,
  voidMystery,
  waterMystery,
} from "../../normal/mystery";
import { battleAxe, longsword, mace, theHammer } from "../../normal/weapons";
import { rabbitChineseZodiac } from "../../normal/zodiacs";
import { mythsGroup } from "../_index";

export const OriginalMythGroup = new Group({ name: "Original Myths" }).addParent(mythsGroup);

export class OriginalMythType extends BouncerType {
  override template(): this {
    super.template();
    return this.setGroup(OriginalMythGroup).addTag(
      TypeTags.BouncerMyth,
      TypeTags.BouncerMythOriginal
    );
  }
}

export class OriginalMythHostType extends BouncerHostType {
  override template(): this {
    super.template();
    return this.setGroup(OriginalMythGroup).addTag(
      TypeTags.BouncerHostMyth,
      TypeTags.BouncerHostMythOriginal
    );
  }
}

// Unicorn
export const theUnicorn = new OriginalMythType("The Unicorn", 505).addBouncerLandsOn(
  treehouse,
  greenie,
  shamrock
);
export const battleUnicorn = new OriginalMythType("Battle Unicorn", 1604)
  .addTag(TypeTags.BouncerMythVariant)
  .addBouncerLandsOn(treehouse, greenie, mace, longsword, battleAxe, theHammer);
export const hippocampUnicorn = new OriginalMythType("Hippocamp Unicorn", 1605)
  .addTag(TypeTags.BouncerMythVariant)
  .addBouncerLandsOn(treehouse, greenie, waterMystery, iceMystery);
export const candyCornUnicorn = new OriginalMythType("Candy Corn Unicorn", 3349).addTag(
  TypeTags.BouncerMythVariant
);
export const unicornHost = new OriginalMythHostType("Unicorn Host", 506)
  .physical()
  .addBouncerHostType(theUnicorn, battleUnicorn, hippocampUnicorn, candyCornUnicorn);

// Leprechaun
export const leprechaun = new OriginalMythType("Leprechaun", 508).addBouncerLandsOn(
  treehouse,
  greenie,
  shamrock
);
export const dwarfLeprechaun = new OriginalMythType("Dwarf Leprechaun", 1646)
  .addTag(TypeTags.BouncerMythVariant)
  .addBouncerLandsOn(skyland, treehouse, greenie, type => type.hasTags(TypeTags.TypeWeaponClan));
export const goblinLeprechaun = new OriginalMythType("Goblin Leprechaun", 1647)
  .addTag(TypeTags.BouncerMythVariant)
  .addBouncerLandsOn(
    skyland,
    treehouse,
    greenie,
    type => type.hasTags(TypeTags.TypeJewel) && type.munzee_id !== 148
  );
export const lepreCorn = new OriginalMythType("LepreCorn", 3367).addTag(
  TypeTags.BouncerMythVariant
);
export const ladyLeprechaun = new OriginalMythType("Lady Leprechaun", 3654).addTag(
  TypeTags.BouncerMythVariant
);
export const leprechaunHost = new OriginalMythHostType("Leprechaun Host", 509)
  .physical()
  .addBouncerHostType(leprechaun, dwarfLeprechaun, goblinLeprechaun, lepreCorn);
export const leprechaunVirtualHost = new OriginalMythHostType("Leprechaun Virtual Host", 1651)
  .virtual()
  .addBouncerHostType(leprechaun, dwarfLeprechaun, goblinLeprechaun, lepreCorn);

// Dragon
export const dragon = new OriginalMythType("Dragon", 573).addBouncerLandsOn(
  treehouse,
  greenie,
  fireMystery
);
export const chineseDragon = new OriginalMythType("Chinese Dragon", 1874)
  .addTag(TypeTags.BouncerMythVariant)
  .addBouncerLandsOn(skyland, treehouse, greenie, fireMystery, airMystery, type =>
    type.hasTags(TypeTags.TypeZodiacChinese)
  );
export const wyvernDragon = new OriginalMythType("Wyvern Dragon", 1875)
  .addTag(TypeTags.BouncerMythVariant)
  .addBouncerLandsOn(
    skyland,
    treehouse,
    greenie,
    airMystery,
    amethyst,
    type => type.meta.evolution?.base === coin.id
  );
export const midnightDragon = new OriginalMythType("Midnight Dragon", 3370).addTag(
  TypeTags.BouncerMythVariant
);
export const dragonHost = new OriginalMythHostType("Dragon Host", 574)
  .physical()
  .addBouncerLandsOn(dragon, chineseDragon, wyvernDragon, midnightDragon);
export const dragonVirtualHost = new OriginalMythHostType("Dragon Virtual Host", 1878)
  .virtual()
  .addBouncerLandsOn(dragon, chineseDragon, wyvernDragon, midnightDragon);

// Yeti
export const yeti = new OriginalMythType("Yeti", 725).addBouncerLandsOn(
  treehouse,
  greenie,
  iceMystery
);
export const lycanthropeYeti = new OriginalMythType("Lycanthrope Yeti", 1876)
  .addTag(TypeTags.BouncerMythVariant)
  .addBouncerLandsOn(treehouse, greenie, earthMystery, fireMystery, voidMystery, type =>
    type.hasTags(TypeTags.TypeZodiacWestern)
  );
export const reptoidYeti = new OriginalMythType("Reptoid Yeti", 1877)
  .addTag(TypeTags.BouncerMythVariant)
  .addBouncerLandsOn(treehouse, greenie, earthMystery, waterMystery);
export const monsterYeti = new OriginalMythType("Monster Yeti", 3368).addTag(
  TypeTags.BouncerMythVariant
);
export const whiteRabbitYeti = new OriginalMythType("White Rabbit", 3905)
  .addTag(TypeTags.BouncerMythVariant)
  .addBouncerLandsOn(
    greenie,
    rabbitChineseZodiac,
    goldenCarrot,
    carrotEvos,
    voidMystery,
    treehouse,
    skyland
  );
export const yetiHost = new OriginalMythHostType("Yeti Host", 726)
  .physical()
  .addBouncerLandsOn(yeti, lycanthropeYeti, reptoidYeti, monsterYeti, whiteRabbitYeti);
