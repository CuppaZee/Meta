import { Group } from "../../src/items/group";
import {
  BouncerType,
  EvolutionTypeSet,
  ScatterType,
  TypeHidden,
  TypeTags,
} from "../../src/items/type";
import { tomato, tomatoPlant, tomatoSeed } from "../evolutions/farm";
import { coin } from "../evolutions/reseller";
import { skyland, treehouse } from "../normal/destination";
import { flatDiscGolfBasket, flatMatt } from "../normal/flats";
import { bowling, joystickPhysical, joystickVirtual, prizeWheel, surprise } from "../normal/gaming";
import { pinkDiamond, ruby } from "../normal/jewels";
import { premium, greenie, shamrock, virtualShamrock } from "../normal/misc";
import { mystery } from "../normal/mystery";
import { poiCampground, poiCinema } from "../normal/places";
import { crossbow, longsword, mace, shield } from "../normal/weapons";
import { mechzGroup } from "./_index";

export const MechGroup = new Group({ name: "MechZ" }).addParent(mechzGroup);

export class MechType extends BouncerType {
  override template(): this {
    super.template();
    return this.setGroup(MechGroup).addTag(TypeTags.BouncerTPOB);
  }
}

export class BrokenMechType extends BouncerType {
  override template(): this {
    super.template();
    return this.setGroup(MechGroup).addTag(TypeTags.BouncerTPOB).addHidden(TypeHidden.Bouncers);
  }
}

export class MechScatterType extends ScatterType {
  override template(): this {
    super.template();
    return this.setGroup(MechGroup);
  }
}

export const spyderbot = new MechType("Spyderbot", 2589);
export const squashedSpyderbot = new BrokenMechType("Squashed Spyderbot", 2590);

export const lASERShark = new MechType("L.A.S.E.R. Shark", 2875)
  .setIcon("lasershark")
  .addBouncerLandsOn(
    type => type.hasTags(TypeTags.TypeMysteryElemental),
    type => type.hasTags(TypeTags.TypeWeaponZeeops)
  );
export const brokenLASERShark = new BrokenMechType("Broken L.A.S.E.R. Shark", 3624).setIcon(
  "brokenlasershark"
);

export const brokenGoldenLASERShark = new BrokenMechType(
  "Broken Golden L.A.S.E.R. Shark",
  3625
).setIcon("brokengoldenlasershark");
export const goldenLASERShark = new MechType("Golden L.A.S.E.R. Shark", 2954)
  .setIcon("goldenlasershark")
  .addBouncerLandsOn(
    type => type.hasTags(TypeTags.TypeMysteryElemental),
    type => type.hasTags(TypeTags.TypeWeaponZeeops),
    premium
  );
export const brokenArcticLASERShark = new BrokenMechType(
  "Broken Arctic L.A.S.E.R. Shark",
  3626
).setIcon("brokenarcticlasershark");
export const arcticLASERShark = new MechType("Arctic L.A.S.E.R. Shark", 3051)
  .setIcon("arcticlasershark")
  .addBouncerLandsOn(
    type => type.hasTags(TypeTags.TypeMysteryElemental),
    type => type.hasTags(TypeTags.TypeWeaponZeeops),
    joystickPhysical,
    joystickVirtual
  );
export const brokenGeoLoggersRUMBot = new BrokenMechType("Broken GeoLoggers RUM Bot", 3628);
export const geoLoggersRUMBot = new MechType("GeoLoggers RUMBot", 3101).addBouncerLandsOn(
  greenie,
  type => type.hasTags(TypeTags.TypeReseller),
  type => type.meta.evolution?.base === coin.id,
  type => type.hasTags(TypeTags.TypeVirtual),
  skyland,
  treehouse
);
export const brokenGoldnCoinsRUMBot = new BrokenMechType(
  "Broken Gold'n Coins RUMBot",
  3627
).setIcon("brokengoldncoinsrumbot", "brokengold'ncoinsrumbot");
export const goldnCoinsRUMBot = new MechType("Gold'n Coins RUMBot", 3100)
  .addIcon("goldncoinsrumbot")
  .addBouncerLandsOn(
    greenie,
    type => type.hasTags(TypeTags.TypeReseller),
    type => type.meta.evolution?.base === coin.id,
    type => type.hasTags(TypeTags.TypeVirtual),
    skyland,
    treehouse
  );
export const brokenNEGSRUMBot = new BrokenMechType("Broken NEGS RUMBot", 3629);
export const nEGSRUMBot = new MechType("NEGS RUMBot", 3102).addBouncerLandsOn(
  greenie,
  type => type.hasTags(TypeTags.TypeReseller),
  type => type.meta.evolution?.base === coin.id,
  type => type.hasTags(TypeTags.TypeVirtual),
  skyland,
  treehouse
);
export const brokenSCGSRUMBot = new BrokenMechType("Broken SCGS RUMBot", 3630);
export const sCGSRUMBot = new MechType("SCGS RUMBot", 3103).addBouncerLandsOn(
  greenie,
  type => type.hasTags(TypeTags.TypeReseller),
  type => type.meta.evolution?.base === coin.id,
  type => type.hasTags(TypeTags.TypeVirtual),
  skyland,
  treehouse
);
export const mechaniC4K3 = new MechType("MechaniC4K3", 3124);
export const crumbledMechaniC4K3 = new BrokenMechType("Crumbled MechaniC4K3", 3125);

export const sC4RAB = new MechScatterType("SC4RAB", 3172).standalone();
export const s4RC0PH4GUS = new MechType("S4RC0PH4GUS", 3170);
export const brokenMumm33 = new MechType("Broken MUMM33", 3631).addHidden(
  TypeHidden.Deploy,
  TypeHidden.Bouncers
);
export const mUMM33 = new MechType("MUMM33", 3171).scattererScatters(sC4RAB);

export const mumm33Set = new EvolutionTypeSet([s4RC0PH4GUS, mUMM33]);

export const mONK3Y = new MechType("MONK3Y", 3307);
export const priM8 = new MechType("PriM8", 3308);
export const kiNGC0G = new MechType("KiNG C0G", 3309);
export const kiNGC0GCrushed = new BrokenMechType("KiNG C0G Crushed", 3312); //3310

export const monk3ySet = new EvolutionTypeSet([mONK3Y, priM8, kiNGC0G]);

export const botwurst = new MechScatterType("Botwurst", 3319).standalone();
export const steinBot = new MechType("SteinBot", 3317).scattererScatters(botwurst);
export const emptySteinBot = new BrokenMechType("Empty SteinBot", 3318).setIcon("steinbotempty");

export const dronut = new MechScatterType("Dronut", 3322).standalone();
export const carafeBorg = new MechType("CarafeBorg", 3320).scattererScatters(dronut);
export const emptyCarafeBorg = new BrokenMechType("Empty CarafeBorg", 3321).setIcon(
  "carafeborgempty"
);

export const flamingPumpkin = new MechScatterType("Flaming Pumpkin", 3325).standalone();
export const h3ADL3SSH0RS3MAN = new MechType("H3ADL3SS H0RS3MAN", 3323).scattererScatters(
  flamingPumpkin
);
export const smashedH3ADL3SSH0RS3MAN = new BrokenMechType(
  "Smashed H3ADL3SS H0RS3MAN",
  3324
).setIcon("h3adl3ssh0rs3mansmashed");

export const lOC04LMOTIVE = new MechType("LOC04LMOTIVE", 3419);
export const lOC04LMOTIVEOverheated = new MechType("LOC04LMOTIVE Overheated", 3420);

export const wR3NCH = new MechScatterType("WR3NCH", 3522).standalone();
export const gWRENCH = new MechType("GWRENCH", 3520).scattererScatters(wR3NCH);
export const gWRENCHCombusted = new BrokenMechType("GWRENCH Combusted", 3521);

export const n1NJ4ST4R = new MechScatterType("N1NJ4 ST4R", 3416).standalone();
export const tR33T0PP3R = new MechType("TR33 T0PP3R", 3414).scattererScatters(n1NJ4ST4R);
export const tR33T0PP3RTakeoff = new BrokenMechType("TR33 T0PP3R Takeoff", 3415);

export const sn0wBomb = new MechScatterType("SN0W Bomb", 3572).standalone();
export const abominableSN0WMachine = new MechType(
  "Abominable SN0W Machine",
  3570
).scattererScatters(sn0wBomb);
export const abominableSN0WMachineFrostbitten = new BrokenMechType(
  "Abominable SN0W Machine Frostbitten",
  3571
);

export const toast33 = new MechScatterType("Toast33", 3577).standalone();
export const breadBot = new MechType("Bread Bot", 3575).scattererScatters(toast33);
export const burntBreadBot = new BrokenMechType("Burnt Bread Bot", 3576);

export const heartThRobot = new MechScatterType("Heart ThRobot", 3616)
  .setIcon("heartthrobots", "heartthrobot")
  .standalone();
export const rougeBot = new MechScatterType("Rouge Bot", 3619).standalone();
export const xBot = new MechType("X Bot", 3614)
  .scattererScatters(heartThRobot)
  .addBouncerLandsOn(
    greenie,
    premium,
    mystery,
    pinkDiamond,
    surprise,
    prizeWheel,
    shamrock,
    virtualShamrock,
    longsword,
    shield,
    type => type.hasTags(TypeTags.VirtualColourRed),
    flatMatt,
    flatDiscGolfBasket,
    poiCampground,
    treehouse,
    skyland
  );
export const xhaustedXBot = new BrokenMechType("Xhausted X Bot", 3615);
export const oBot = new MechType("O Bot", 3617)
  .scattererScatters(rougeBot)
  .addBouncerLandsOn(
    greenie,
    premium,
    mystery,
    ruby,
    tomato,
    tomatoPlant,
    tomatoSeed,
    surprise,
    bowling,
    mace,
    crossbow,
    type => type.hasTags(TypeTags.VirtualColourPink),
    poiCinema,
    treehouse,
    skyland
  );
export const offBalanceOBot = new BrokenMechType("Off Balance O Bot", 3618);

export const l0v3Bug = new MechScatterType("L0v3 Bug", 3613).standalone();
export const eros404 = new MechType("Eros 404", 3611).scattererScatters(l0v3Bug);
export const heartbrokenEros404 = new BrokenMechType("Heartbroken Eros 404", 3612);

export const c00k13s = new MechScatterType("C00K13S", 3660).standalone();
export const m0th3rb04rd = new MechType("M0TH3RB04RD", 3658).scattererScatters(c00k13s);
export const burntM0th3rb04rd = new BrokenMechType("Burnt M0TH3RB04RD", 3659);

export const hourglass = new MechScatterType("Hourglass", 3663).standalone();
export const fatherTim3 = new MechType("Father TiM3", 3661).scattererScatters(hourglass);
export const dizzyFatherTim3 = new BrokenMechType("Dizzy Father TiM3", 3662);

export const blarneyBeats = new MechScatterType("Blarney Beats", 3641).standalone();
export const shamRockNRolla = new MechType("Sham Rock n Rolla", 3639).scattererScatters(
  blarneyBeats
);
export const shamRockNRollaSmashed = new BrokenMechType("Smashed Sham Rock n Rolla", 3640);

export const p33l = new MechScatterType("P33L", 3676).standalone();
export const bananaBorg = new MechType("BananaBorg", 3674).scattererScatters(p33l);
export const bananaBorgBrown = new BrokenMechType("Brown BananaBorg", 3675).scattererScatters(p33l);

export const m4ck3rel = new MechScatterType("M4CK3REL", 3718).standalone();
export const p3n9u1n = new MechType("P3N9U1N", 3716).scattererScatters(m4ck3rel);
export const p3n9u1nFrozen = new BrokenMechType("Frozen P3N9U1N", 3717).scattererScatters(m4ck3rel);

export const kingM4ck3rel = new MechScatterType("KiNG M4CK3REL", 3721).standalone();
export const emperorP3n9u1n = new MechType("Emperor P3N9U1N", 3719).scattererScatters(kingM4ck3rel);
export const emperorP3n9u1nFrozen = new BrokenMechType(
  "Frozen Emperor P3N9U1N",
  3720
).scattererScatters(kingM4ck3rel);

export const f0ssil = new MechScatterType("F0SSiL", 3744).standalone();
export const r3x0skeleton = new MechType("R3X-0-Skeleton", 3742).scattererScatters(f0ssil);
export const shippedR3x0skeleton = new BrokenMechType(
  "Shipped R3X-0-Skeleton",
  3743
).scattererScatters(f0ssil);

export const cappi = new MechType("CAPPi", 3746);
export const sleepModeCappi = new MechType("Sleep Mode CAPPi", 3747);

export const pitt = new MechScatterType("PiTT", 3754).standalone();
export const robocado = new MechType("Robocado", 3752).scattererScatters(pitt);
export const brownRobocado = new BrokenMechType("Brown Robocado", 3753).scattererScatters(pitt);

export const pinkPetal = new MechScatterType("Pink PETAL", 3801).standalone();
export const purplePetal = new MechScatterType("Purple PETAL", 3799).standalone();
export const redPetal = new MechScatterType("Red PETAL", 3803).standalone();
export const yellowPetal = new MechScatterType("Yellow PETAL", 3805).standalone();
export const s33dl1n9 = new MechType("S33DL1N9", 3796);
export const spr0u7 = new MechType("SPR0U7", 3797);
export const n7ul1p = new MechType("7UL1P", 3798).scattererScatters(pinkPetal, purplePetal);
export const wiltedFl0w3r = new BrokenMechType("Wilted FL0W3R", 3795).scattererScatters(
  pinkPetal,
  purplePetal
);
export const bl0ss0m = new MechType("BL0SS0M", 3800).scattererScatters(pinkPetal, purplePetal);
export const sun = new MechType("SUN", 3804).scattererScatters(pinkPetal, purplePetal);
export const r053 = new MechType("R053", 3802).scattererScatters(pinkPetal, purplePetal);
export const paintedR053 = new MechType("Painted R053",3806).scattererScatters(pinkPetal, purplePetal);
