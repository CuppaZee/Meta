import chalk from "chalk";
import { createHash } from "node:crypto";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";
import { Group } from "./group";
import { LegacyType } from "./legacy";
import { Database } from "../database";
import { CZPropertySet, CZReference } from "../czProperties";
import { Operation } from "../czParser";

export enum TypeState {
  Physical = 0x01,
  Virtual = 0x02,
  Bouncer = 0x03,
  Locationless = 0x04,
}

export enum TypePointsType {
  Split = 0x01,
}

export interface TypePoints {
  deploy?: number;
  capture?: number;
  capon?: number;
  type?: TypePointsType;
  split?: number;
  min?: number;
  interval?: number;
}

export enum TypeHidden {
  All = 0x01,
  Inventory = 0x02,
  Bouncers = 0x03,
  Capture = 0x04,
  Deploy = 0x05,
}

export enum TypeTags {
  // Type Tags
  TypeEvent = 0x00,
  TypeEventCustom = 0x01,
  TypeEventStandard = 0x02,

  TypeWeapon = 0x03,
  TypeWeaponClan = 0x04,
  TypeWeaponZeeops = 0x05,

  TypeZodiac = 0x06,
  TypeZodiacWestern = 0x07,
  TypeZodiacChinese = 0x08,
  TypeZodiacEgyptian = 0x09,

  TypeMystery = 0x0a,
  TypeMysteryElemental = 0x0b,

  TypeReseller = 0x0c,
  TypeResellerRetired = 0x0d,

  TypePOI = 0x0e,
  TypeDestination = 0x0f,
  TypeGaming = 0x10,
  TypeJewel = 0x11,
  TypeFlat = 0x12,
  TypeTrail = 0x13,
  TypeTourism = 0x14,
  TypeSeasonal = 0x15,
  TypeUnique = 0x16,
  TypeVirtual = 0x17,

  TypePersonal = 0x18,
  TypeSocial = 0x19,
  TypeUniversal = 0x1a,

  // Bouncer Tags
  BouncerPC = 0x1b,
  BouncerPCS1 = 0x1c,
  BouncerPCS2 = 0x1d,
  BouncerPCEscaped = 0x1e,
  BouncerPCZombie = 0x1f,
  BouncerPCFunfinity = 0x20,
  BouncerPCGleaming = 0x21,
  BouncerPCStageless = 0x22,
  BouncerPCStage1 = 0x23,
  BouncerPCStage2 = 0x24,
  BouncerPCStage3 = 0x25,
  BouncerMyth = 0x26,
  BouncerMythOriginal = 0x27,
  BouncerMythClassical = 0x28,
  BouncerMythMirror = 0x29,
  BouncerMythStoryland = 0x7e,
  BouncerMythModern = 0x2a,
  BouncerMythAlterna = 0x2b,
  BouncerMythVariant = 0x2c,
  BouncerRetired = 0x2d,
  BouncerFlat = 0x2e,
  BouncerFlatPhantom = 0x2f,
  BouncerEvolution = 0x30,
  BouncerTPOB = 0x31,
  BouncerTPOBBabyAnimal = 0x32,
  BouncerNomad = 0x33,
  BouncerSeasonal = 0x34,
  BouncerSeasonal2022 = 0x79,
  BouncerSeasonal2021 = 0x35,
  BouncerSeasonal2020 = 0x36,
  BouncerSeasonal2019 = 0x37,
  BouncerSeasonal2018 = 0x38,
  BouncerSeasonal2017 = 0x39,
  BouncerSeasonal2016 = 0x3a,
  BouncerSeasonal2015 = 0x3b,
  BouncerSeasonalLegacy = 0x3c,
  Bouncer = 0x3d,

  // Bouncer Host Tags
  BouncerHostPC = 0x3e,
  BouncerHostPCEscaped = 0x3f,
  BouncerHostPCZombie = 0x40,
  BouncerHostPCFunfinity = 0x41,
  BouncerHostPCGleaming = 0x42,
  BouncerHostPCStage1 = 0x43,
  BouncerHostPCStage2 = 0x44,
  BouncerHostPCStage3 = 0x45,
  BouncerHostMyth = 0x46,
  BouncerHostMythOriginal = 0x47,
  BouncerHostMythClassical = 0x48,
  BouncerHostMythMirror = 0x49,
  BouncerHostMythModern = 0x4a,
  BouncerHostMythStoryland = 0x7f,
  BouncerHostMythAlterna = 0x4b,
  BouncerHostMythVariant = 0x4c,
  BouncerHostRetired = 0x4d,
  BouncerHostFlat = 0x4e,
  BouncerHostEvolution = 0x4f,
  BouncerHostTPOB = 0x50,
  BouncerHostTPOBBabyAnimal = 0x51,
  BouncerHostSeasonal = 0x52,
  BouncerHostSeasonal2021 = 0x53,
  BouncerHostSeasonal2020 = 0x54,
  BouncerHostSeasonal2019 = 0x55,
  BouncerHostSeasonal2018 = 0x56,
  BouncerHostSeasonal2017 = 0x57,
  BouncerHostSeasonalLegacy = 0x58,
  BouncerHost = 0x59,

  // Card Tags
  Card = 0x5a,
  CardOpen = 0x5b,
  Card2020 = 0x5c,
  Card2020HCCC = 0x5d,
  Card2021 = 0x5e,
  Card2021VCCC = 0x5f,
  Card2021BCCC = 0x77,
  Card2022 = 0x7a,
  Card2022VMailbox = 0x7b,
  Card2022UnBirthdayMailbox = 0x7c,

  // Evolution
  Evolution = 0x60,
  EvolutionFarm = 0x61,
  EvolutionEducation = 0x62,
  EvolutionNature = 0x63,
  EvolutionReseller = 0x64,
  EvolutionGeneric = 0x65,

  // Virtual Colours
  VirtualColourPink = 0x66,
  VirtualColourLouPink = 0x67,
  VirtualColourGreen = 0x68,
  VirtualColourRed = 0x69,
  VirtualColourBlue = 0x6a,
  VirtualColourBlack = 0x6b,
  VirtualColourBrown = 0x6c,

  // Scatter Tags
  Scatter = 0x6d,
  ScatterStandalone = 0x6e,

  // Destination Tags
  DestinationRooms = 0x73,
  DestinationRoom = 0x74,
  DestinationBouncer = 0x75,
  DestinationTemporary = 0x76,
  DestinationBouncerTemporary = 0x7d,

  // Other Tags
  Credit = 0x6f,
  Other = 0x70,
  Redeemable = 0x78,

  // Function Tags
  FunctionSwap = 0x71,
  FunctionBlast = 0x72,
}

// Latest: BouncerHostMythStoryland = 0x7f,

export interface TypeVirtualMeta {
  captureRadius?: number;
}

export interface TypeEvolutionMeta {
  stage?: number;
  base?: number;
}

export interface TypeDestinationMeta {
  size?: number;
  starLevel?: number;
  roomOf?: number;
  temporary?: boolean;
}

export interface TypeBouncerMeta {
  duration?: number;
  landsOn?: TypeReference[];
  base?: TypeReference;
}

export interface TypeBouncerHostMeta {
  types?: TypeReference[];
}

export interface TypeScatterMeta {
  duration?: number;
  landsOn?: TypeReference[];
}

export interface TypeScattererMeta {
  types?: TypeReference[];
  min?: number;
  max?: number;
  radius?: number;
}

export interface TypeMeta {
  virtual?: TypeVirtualMeta;

  evolution?: TypeEvolutionMeta;

  destination?: TypeDestinationMeta;

  bouncer?: TypeBouncerMeta;

  bouncerHost?: TypeBouncerHostMeta;

  scatter?: TypeScatterMeta;

  scatterer?: TypeScattererMeta;
}

export interface TypeDetails {
  related?: {
    blog?: string[];
  };
  description?: string;
}

export interface TypePoints {
  deploy?: number;
  capture?: number;
  capon?: number;
  type?: TypePointsType;
  split?: number;
  min?: number;
  interval?: number;
}

export interface TypeOptions {
  name: string;
  icons?: string[];
  human_id?: string;
  munzee_id?: number;
  state?: TypeState;
  groups?: Group[];
  points?: TypePoints;
  tags?: TypeTags[];
  hidden?: TypeHidden[];
  meta?: TypeMeta;
  details?: TypeDetails;
}

export interface TypeData {
  name: string;
  icons?: string[];
  id: number;
  human_id?: string;
  munzee_id?: number;
  state?: TypeState;
  groups?: (number | string)[];
  points?: TypePoints;
  tags?: TypeTags[];
  hidden?: TypeHidden[];
  meta?: TypeMeta;
  details?: TypeDetails;
}

export type TypeReference = number | Type | ((type: Type) => boolean) | CZReference;

export class Type {
  static ids = new Set<number>();
  static humanIds = new Set<string>();

  private static i = 0;
  internal_id: number = Type.i++;

  static generateId(human_id: string) {
    if (this.humanIds.has(human_id)) {
      throw new Error(`Duplicate human_id: ${human_id}`);
    }
    this.humanIds.add(human_id);
    for (let i = 0; i < 5; i++) {
      const sha = createHash("sha1");
      sha.update(`${human_id}${i}`);
      const id = parseInt(sha.digest("hex").slice(0, i + 2), 16);
      if (!this.ids.has(id)) {
        this.ids.add(id);
        return id;
      }
    }
    throw new Error(`Could not find a unique ID for ${human_id}`);
  }

  _db!: Database;

  public file: string | undefined;
  // Munzee Name
  private data_name: string;
  // Munzee Icons
  private data_icons: string[];
  // CuppaZee ID
  private data_id: number;
  // CuppaZee Human ID
  private data_human_id: string;
  // Munzee ID
  private data_munzee_id?: number;
  // State - `physical`/`virtual`/`bouncer`/`locationless`
  private data_state: TypeState;
  // Groups
  data_groups: Set<Group | CZReference>;
  // Points Data
  private data_points?: TypePoints;
  // Type Tags
  private data_tags: Set<TypeTags>;
  // Type Hidden
  private data_hidden: Set<TypeHidden>;
  // Type Meta
  private data_meta: TypeMeta;
  // Type Meta
  private data_details: TypeDetails;

  constructor(name: string, munzee_id?: number);
  constructor(parameters: TypeOptions);
  constructor(parameters: TypeOptions | string, munzee_id?: number) {
    const options = typeof parameters === "string" ? { name: parameters, munzee_id } : parameters;
    this.data_name = options.name;
    this.data_icons = options.icons ?? [options.name.toLowerCase().replace(/\s+/g, "")];
    this.data_human_id = options.human_id ?? options.name.toLowerCase().replace(/\s/g, "_");
    this.data_id = Type.generateId(this.data_human_id);
    this.data_munzee_id = options.munzee_id;
    this.data_state = options.state!;
    this.data_groups = new Set(options.groups ?? []);
    this.data_points = options.points;
    this.data_tags = new Set(options.tags ?? []);
    this.data_hidden = new Set(options.hidden ?? []);
    this.data_meta = options.meta ?? {};
    this.data_details = options.details ?? {};
    this.template();
  }

  get name(): string {
    return this.data_name;
  }

  get icons(): string[] {
    return this.data_icons;
  }

  get id(): number {
    return this.data_id;
  }

  get human_id(): string {
    return this.data_human_id;
  }

  get munzee_id(): number | undefined {
    return this.data_munzee_id;
  }

  get groups(): (Group | CZReference)[] {
    return [...this.data_groups];
  }

  get state(): TypeState {
    return this.data_state;
  }

  get points(): TypePoints | undefined {
    return this.data_points;
  }

  get tags(): TypeTags[] {
    return [...this.data_tags];
  }

  get hidden(): TypeHidden[] {
    return [...this.data_hidden];
  }

  get meta(): TypeMeta {
    return this.data_meta;
  }

  setName(name: string): this {
    this.data_name = name;
    return this;
  }

  addIcons(...icons: (string | string[])[]): this {
    this.data_icons.push(...icons.flat());
    return this;
  }

  addIcon = this.addIcons;

  setIcons(...icons: (string | string[])[]): this {
    this.data_icons = icons.flat();
    return this;
  }

  setIcon = this.setIcons;

  setHumanId(humanId: string): this {
    this.data_human_id = humanId;
    return this;
  }

  setMunzeeId(munzee_id: number | undefined): this {
    this.data_munzee_id = munzee_id;
    return this;
  }

  addGroups(...groups: (Group | Group[])[]): this {
    for (const group of groups.flat()) {
      this.data_groups.add(group);
    }
    return this;
  }

  addGroup = this.addGroups;

  setGroups(...groups: (Group | CZReference | Group[] | CZReference[])[]): this {
    this.data_groups = new Set(groups.flat());
    return this;
  }

  setGroup = this.setGroups;

  setState(state: TypeState): this {
    this.data_state = state;
    return this;
  }

  physical() {
    return this.setState(TypeState.Physical);
  }

  virtual() {
    return this.setState(TypeState.Virtual);
  }

  locationless() {
    return this.setState(TypeState.Locationless);
  }

  setPoints(points: TypePoints | undefined): this {
    this.data_points = points;
    return this;
  }

  removeTags(...tags: (TypeTags | TypeTags[])[]): this {
    for (const tag of tags.flat()) {
      this.data_tags.delete(tag);
    }
    return this;
  }

  addTags(...tags: (TypeTags | TypeTags[])[]): this {
    for (const tag of tags.flat()) {
      this.data_tags.add(tag);
    }
    return this;
  }

  addTag = this.addTags;

  hasTags(...tags: (TypeTags | TypeTags[])[]): boolean {
    return tags.flat().every(tag => this.data_tags.has(tag));
  }

  setTags(...tags: (TypeTags | TypeTags[])[]): this {
    this.data_tags = new Set(tags.flat());
    return this;
  }

  setTag = this.setTags;

  addHidden(...hiddenList: (TypeHidden | TypeHidden[])[]): this {
    for (const hidden of hiddenList.flat()) {
      this.data_hidden.add(hidden);
    }
    return this;
  }

  setHidden(...hidden: (TypeHidden | TypeHidden[])[]): this {
    this.data_hidden = new Set(hidden.flat());
    return this;
  }

  setMeta(meta: TypeMeta): this {
    this.data_meta = meta;
    return this;
  }

  scattererDistance(distance: number): this {
    this.data_meta.scatterer ??= {};
    this.data_meta.scatterer.radius = distance;
    return this;
  }

  scattererScatters(...types: (TypeReference | TypeReference[])[]): this {
    this.data_meta.scatterer ??= {};
    this.data_meta.scatterer.types ??= [];
    this.data_meta.scatterer.types.push(...types.flat());
    return this;
  }

  destinationSize(size: number): this {
    this.data_meta.destination ??= {};
    this.data_meta.destination.size = size;
    return this;
  }

  destinationStarLevel(starLevel: number): this {
    this.data_meta.destination ??= {};
    this.data_meta.destination.starLevel = starLevel;
    return this;
  }

  destinationRoomOf(type: Type): this {
    this.data_meta.destination ??= {};
    this.data_meta.destination.roomOf = type.id;
    return this;
  }

  addBouncerLandsOn(...types: (TypeReference | TypeReference[])[]): this {
    this.data_meta.bouncer ??= {};
    this.data_meta.bouncer.landsOn ??= [];
    this.data_meta.bouncer.landsOn.push(...types.flat());
    return this;
  }

  setBouncerLandsOn(...types: (TypeReference | TypeReference[])[]): this {
    this.data_meta.bouncer ??= {};
    this.data_meta.bouncer.landsOn = types.flat();
    return this;
  }

  setEvolutionStage(stage: number): this {
    this.data_meta.evolution ??= {};
    this.data_meta.evolution.stage = stage;
    if (stage > 1) {
      this.addHidden(TypeHidden.Deploy);
    }
    return this;
  }

  setEvolutionBase(base: Type): this {
    this.data_meta.evolution ??= {};
    this.data_meta.evolution.base = base.id;
    return this;
  }

  addBouncerHostType(...types: (TypeReference | TypeReference[])[]): this {
    this.data_meta.bouncerHost ??= {};
    this.data_meta.bouncerHost.types ??= [];
    this.data_meta.bouncerHost.types.push(...types.flat());
    return this;
  }

  setBouncerHostType(...types: (TypeReference | TypeReference[])[]): this {
    this.data_meta.bouncerHost ??= {};
    this.data_meta.bouncerHost.types = types.flat();
    return this;
  }

  addRelatedBlog(...blogs: (string | string[])[]): this {
    this.data_details.related ??= {};
    this.data_details.related.blog ??= [];
    this.data_details.related.blog.push(...blogs.flat());
    return this;
  }

  setRelatedBlog(...blogs: (string | string[])[]): this {
    this.data_details.related ??= {};
    this.data_details.related.blog = blogs.flat();
    return this;
  }

  setDescription(description: string): this {
    this.data_details.description = description;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  template(): void {}

  toJSON(variant?: "regular"): Omit<TypeData, "details"> & { icons: string[]; human_id: string };
  toJSON(variant: "compact"): Omit<TypeData, "details">;
  toJSON(variant: "full"): TypeData & { icons: string[]; human_id: string };
  toJSON(variant?: "compact" | "regular" | "full") {
    const data: TypeData = {
      name: this.data_name,
      id: this.data_id,
    };

    if (
      variant !== "compact" ||
      this.data_icons.join(".") !== this.data_name.toLowerCase().replace(/\s+/g, "")
    )
      data.icons = this.data_icons;

    if (
      variant !== "compact" ||
      this.data_human_id !== this.data_name.toLowerCase().replace(/\s/g, "_")
    )
      data.human_id = this.data_human_id;

    if (this.data_munzee_id !== undefined) data.munzee_id = this.data_munzee_id;

    if (this.data_state) data.state = this.data_state;

    if (this.data_groups) data.groups = ([...this.data_groups] as Group[]).map(i => i.id).sort();

    if (this.data_points) data.points = this.data_points;

    if (this.data_tags.size > 0) data.tags = [...this.data_tags].sort();

    if (this.data_hidden.size > 0) data.hidden = [...this.data_hidden].sort();

    if (Object.keys(this.data_meta).length > 0)
      data.meta = {
        virtual: this.data_meta.virtual,

        evolution: this.data_meta.evolution,

        destination: this.data_meta.destination,

        bouncer: this.data_meta.bouncer
          ? {
              duration: this.data_meta.bouncer.duration,
              landsOn: this.data_meta.bouncer.landsOn?.slice().sort(),
              base: this.data_meta.bouncer.base,
            }
          : undefined,

        bouncerHost: this.data_meta.bouncerHost
          ? {
              types: this.data_meta.bouncerHost.types?.slice().sort(),
            }
          : undefined,

        scatter: this.data_meta.scatter
          ? {
              duration: this.data_meta.scatter.duration,
              landsOn: this.data_meta.scatter.landsOn?.slice().sort(),
            }
          : undefined,

        scatterer: this.data_meta.scatterer
          ? {
              types: this.data_meta.scatterer.types?.slice().sort(),
              min: this.data_meta.scatterer.min,
              max: this.data_meta.scatterer.max,
              radius: this.data_meta.scatterer.radius,
            }
          : undefined,
      };

    if (variant === "full" && Object.keys(this.data_details).length > 0) {
      data.details = this.data_details;
    }

    return data;
  }

  addToXML(xml: XMLBuilder, compact?: boolean): void {
    const type = xml.ele("type");
    type.ele("name").txt(this.data_name).up();
    type.att("id", this.data_id.toString());

    if (!compact || this.data_icons.join(".") !== this.data_name.toLowerCase().replace(/\s+/g, ""))
      for (const icon of this.data_icons) type.ele("icon").txt(icon).up();

    if (!compact || this.data_human_id !== this.data_name.toLowerCase().replace(/\s/g, "_"))
      type.att("human_id", this.data_human_id);

    if (this.data_munzee_id !== undefined) type.att("munzee_id", this.data_munzee_id.toString());

    if (this.data_state) type.ele("state").txt(this.data_state.toString()).up();

    if (this.data_groups)
      for (const group of this.data_groups)
        type
          .ele("group")
          .txt((group as Group).id.toString())
          .up();

    if (this.data_points) type.ele("points").txt(JSON.stringify(this.data_points)).up();

    if (this.data_tags.size > 0)
      for (const tag of this.data_tags) type.ele("tag").txt(tag.toString()).up();

    if (this.data_hidden.size > 0)
      for (const hidden of this.data_hidden) type.ele("hidden").txt(hidden.toString()).up();

    if (Object.keys(this.data_meta).length > 0) {
      const meta = type.ele("meta");
      if (this.data_meta.bouncer) {
        const bouncer = meta.ele("bouncer");
        if (this.data_meta.bouncer.base)
          bouncer.ele("base").txt(this.data_meta.bouncer.base.toString()).up();
        if (this.data_meta.bouncer.duration)
          bouncer.ele("duration").txt(this.data_meta.bouncer.duration.toString()).up();
        if (this.data_meta.bouncer.landsOn) {
          for (const land of this.data_meta.bouncer.landsOn)
            bouncer.ele("lands_on").txt(land.toString()).up();
        }
      }

      if (this.data_meta.bouncerHost) {
        const bouncerHost = meta.ele("bouncer_host");
        if (this.data_meta.bouncerHost.types) {
          for (const land of this.data_meta.bouncerHost.types)
            bouncerHost.ele("type").txt(land.toString()).up();
        }
      }

      if (this.data_meta.destination) {
        const destination = meta.ele("destination");
        if (this.data_meta.destination.roomOf)
          destination.ele("room_of").txt(this.data_meta.destination.roomOf.toString()).up();
        if (this.data_meta.destination.size)
          destination.ele("size").txt(this.data_meta.destination.size.toString()).up();
        if (this.data_meta.destination.starLevel)
          destination.ele("star_level").txt(this.data_meta.destination.starLevel.toString()).up();
        if (this.data_meta.destination.temporary) destination.ele("temporary").up();
      }

      if (this.data_meta.evolution) {
        const evolution = meta.ele("evolution");
        if (this.data_meta.evolution.base)
          evolution.ele("base").txt(this.data_meta.evolution.base.toString()).up();
        if (this.data_meta.evolution.stage)
          evolution.ele("stage").txt(this.data_meta.evolution.stage.toString()).up();
      }

      if (this.data_meta.scatter) {
        const scatter = meta.ele("scatter");
        if (this.data_meta.scatter.duration)
          scatter.ele("duration").txt(this.data_meta.scatter.duration.toString()).up();
        if (this.data_meta.scatter.landsOn) {
          for (const land of this.data_meta.scatter.landsOn)
            scatter.ele("lands_on").txt(land.toString()).up();
        }
      }

      if (this.data_meta.scatterer) {
        const scatterer = meta.ele("scatterer");
        if (this.data_meta.scatterer.min)
          scatterer.ele("min").txt(this.data_meta.scatterer.min.toString()).up();
        if (this.data_meta.scatterer.max)
          scatterer.ele("max").txt(this.data_meta.scatterer.max.toString()).up();
        if (this.data_meta.scatterer.radius)
          scatterer.ele("radius").txt(this.data_meta.scatterer.radius.toString()).up();
        if (this.data_meta.scatterer.types) {
          for (const type of this.data_meta.scatterer.types)
            scatterer.ele("type").txt(type.toString()).up();
        }
      }

      if (this.data_meta.virtual) {
        const virtual = meta.ele("virtual");
        if (this.data_meta.virtual.captureRadius)
          virtual.ele("capture_radius").txt(this.data_meta.virtual.captureRadius.toString()).up();
      }
    }
  }

  toLegacyJSON(): LegacyType {
    return {
      name: this.data_name,
      icons: this.data_icons,
      id: this.data_id.toString(),
      state: this.data_state,
      category: (this.groups[this.groups.length - 1] as Group).human_id.toString(),
      tags: [...this.data_tags],
      hidden: [...this.data_hidden],
      meta:
        Object.keys(this.meta).length > 0
          ? {
              bouncer_duration: this.meta.bouncer?.duration,
              bouncer_lands_on: this.meta.bouncer?.landsOn?.map(i => i.toString()),
              evolution_base: this.meta.evolution?.base?.toString(),
              evolution_stage: this.meta.evolution?.stage,
              scatterer_radius: this.meta.scatterer?.radius,
              scatterer_types: this.meta.scatterer?.types?.map(i => i.toString()),
              scatterer_min: this.meta.scatterer?.min,
              scatterer_max: this.meta.scatterer?.max,
              host_types: this.meta.bouncerHost?.types?.map(i => i.toString()),
              destination_size: this.meta.destination?.size,
              destination_star_level: this.meta.destination?.starLevel,
              destination_room_of: this.meta.destination?.roomOf?.toString(),
              destination_temporary: this.meta.destination?.temporary,
              scatter_duration: this.meta.scatter?.duration,
            }
          : undefined,
      munzee_id: this.data_munzee_id,
      group: undefined,
    };
  }
}

export class BouncerType extends Type {
  override template(): this {
    super.template();
    return this.addTag(TypeTags.Bouncer)
      .setState(TypeState.Bouncer)
      .addHidden(TypeHidden.Inventory);
  }
}

export class BouncerHostType extends Type {
  override template(): this {
    super.template();
    return this.addTag(TypeTags.BouncerHost).addHidden(TypeHidden.Inventory, TypeHidden.Deploy);
  }

  override virtual = () => {
    super.virtual();
    if (
      this.icons[0] === this.name.toLowerCase().replace(/\s+/g, "") &&
      this.icons[0].endsWith("virtualhost")
    ) {
      this.icons[0] = this.name.toLowerCase().replace(/\s/g, "_");
    }
    return this;
  };
}

export class ScatterType extends Type {
  override template(): this {
    super.template();
    return this.addTag(TypeTags.Scatter).addHidden(TypeHidden.Inventory, TypeHidden.Deploy);
  }

  standalone() {
    return this.virtual()
      .addTag(TypeTags.ScatterStandalone)
      .setHidden(this.hidden.filter(i => i !== TypeHidden.Deploy));
  }
}

export class TypeDatabase {
  private data: Set<Type>;
  private referencesResolved = false;

  _db!: Database;

  constructor() {
    this.data = new Set();
  }

  public add(...types: (Type[] | Type)[]): this {
    if (this.referencesResolved)
      throw new Error("Cannot add types after references have been resolved");
    for (const type of types.flat()) {
      if (!type.name) throw new Error(`Type ${JSON.stringify(type)} must have a name`);
      if (!type.state) throw new Error(`Type ${type.name} must have a state`);
      type._db = this._db;
      this.data.add(type);
    }
    return this;
  }

  public get(id: string | number): Type | undefined {
    return [...this.data].find(type => type.id === id || type.human_id === id);
  }

  get types(): Type[] {
    return [...this.data];
  }

  private resolveReference(
    typeProperties: CZPropertySet[],
    type: Type,
    ref: TypeReference
  ): number[] {
    if (typeof ref === "number") return [ref];
    if (ref instanceof Type) return [ref.id];
    if (ref instanceof CZReference) {
      const resolvedRef = ref.resolve(typeProperties, "name");
      return resolvedRef.map(i => i.get("id").requiredNumbers).flat();
    }
    const types = this.types.filter(ref);
    if (types.length === 0)
      console.warn(
        chalk.gray`[{yellow WARN}] ${
          type.file
        }: Could not resolve reference ${ref.toString()} for ${type.name}`
      );
    return types.map(i => i.id);
  }

  public resolveReferences(): void {
    if (this.referencesResolved) throw new Error("References have already been resolved");
    this.referencesResolved = true;
    const typeProperties: CZPropertySet[] = this.types.map(
      type =>
        new CZPropertySet([
          {
            key: "name",
            value: [[type.name]],
            operation: Operation.Equals,
          },
          {
            key: "id",
            value: [[type.id.toString()]],
            operation: Operation.Equals,
          },
        ])
    );
    for (const type of this.types) {
      type.data_groups = new Set(
        [...type.data_groups].map(i => this._db.groups.publicResolveReference(type, i)).flat()
      );
      if (type.meta.scatterer?.types) {
        type.meta.scatterer.types = type.meta.scatterer.types
          .map(i => this.resolveReference(typeProperties, type, i))
          .flat();
      }
      if (type.meta.scatter?.landsOn) {
        type.meta.scatter.landsOn = type.meta.scatter.landsOn
          .map(i => this.resolveReference(typeProperties, type, i))
          .flat();
      }
      if (type.meta.bouncer?.landsOn) {
        type.meta.bouncer.landsOn = type.meta.bouncer.landsOn
          .map(i => this.resolveReference(typeProperties, type, i))
          .flat();
      }
      if (type.meta.bouncerHost?.types) {
        type.meta.bouncerHost.types = type.meta.bouncerHost.types
          .map(i => this.resolveReference(typeProperties, type, i))
          .flat();
      }
      delete type.file;
    }
  }
}

export class TypeSet<T extends Type = Type> extends Array<T> {
  private static i = 0;
  internal_id: number = TypeSet.i++;

  constructor(array?: T[]) {
    super();
    if (array) this.push(...array);
  }

  public add(...types: (T[] | T)[]): this {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.push(...(types.flat() as any));
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  each(callbackfn: (value: T, index: number, array: T[]) => T, thisArg?: any): this {
    this.forEach(callbackfn, thisArg);
    return this;
  }
}

export class EvolutionTypeSet<T extends Type = Type> extends TypeSet<T> {
  constructor(array?: T[], deployableStage = 1) {
    super(array);
    this.deployableStage = deployableStage;
    this.update();
  }

  private deployableStage: number;

  public add(...types: (T[] | T)[]): this {
    super.add(...types);
    this.update();
    return this;
  }

  private update() {
    if (this.length > 0) {
      for (const item of this) {
        if (!item.meta.evolution?.stage) {
          item.setEvolutionStage(
            Math.max(0, ...[...this].map(i => i.meta.evolution?.stage ?? 0)) + 1
          );
        }
      }
      this.sort((a, b) => (a.meta.evolution?.stage ?? 0) - (b.meta.evolution?.stage ?? 0));
      let found = false;
      for (const i of this) {
        i.setEvolutionBase(this[0]);
        if (i.meta.evolution?.stage === this.deployableStage && !found) {
          found = true;
          if (i.state !== TypeState.Bouncer) {
            // @ts-expect-error Need to access private method
            i.data_hidden.delete(TypeHidden.Deploy);
            // @ts-expect-error Need to access private method
            i.data_hidden.delete(TypeHidden.Inventory);
          }
        } else {
          i.addHidden(TypeHidden.Deploy, TypeHidden.Inventory);
        }
      }
    }
  }
}
