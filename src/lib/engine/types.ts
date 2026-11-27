/**
 * Kształt danych w src/data/rates-2026.json. Plik JSON jest jedynym źródłem liczb:
 * liczy z niego silnik, a strona „Metodologia” wypisuje z niego tabele ze źródłami.
 */
export interface SourceRef { title: string; url: string; basis?: string; accessed?: string }

export interface PitRates {
  rate1: number; rate2: number; threshold: number; taxFree: number; reducingAnnual: number; reducingMonthly: number;
  kupMonthly: number; kupMonthlyElevated: number; kupAnnual: number; kupAnnualElevated: number;
  kupZlecenie: number; youngLimit: number; linearRate: number; solidarityRate: number; solidarityThreshold: number;
  childRelief: number[]; childReliefOneChildIncomeLimit: number; childReliefOneChildIncomeLimitSingle: number;
}

export interface ZusRates {
  emerEmp: number; emerEr: number; rentEmp: number; rentEr: number; chor: number; wyp: number; fp: number; fgsp: number;
  annualCap: number;
}

export interface HealthRates {
  rate: number; linearRate: number; minMonthly: number; minMonthlyJanuary: number; linearDeductLimit: number;
  ryczaltBands: number[]; ryczaltMonthly: number[]; ryczaltMonthlyJanuary: number[];
}

export interface B2BRates { duzyBase: number; prefBase: number; ryczaltRates: number[] }

export interface Wages { minimum: number; forecastAverage: number; average: number; averageLabel: string; median?: number; medianLabel?: string }

/** Jedna kategoria koszyka (COICOP) i udział podatków ukrytych w jej cenach. */
export interface BasketCategory {
  id: string; label: string; plain: string;
  /** Udział kategorii w wydatkach, osobno dla kwintyli 1–5 (suma kategorii = 1). */
  shares: number[];
  /** Jaka część wydanej kwoty to VAT (np. 23% stawki to 23/123 ≈ 0,187 ceny). */
  vatShare: number;
  /** Jaka część wydanej kwoty to akcyza i opłaty celowe (paliwowa, emisyjna, cukrowa, mocowa…). */
  exciseShare: number;
  note: string;
}

/** Produkt do przykładu „ile podatku jest w cenie”: VAT liczony ze stawki, akcyza i opłaty kwotowo (zł za sztukę). */
export interface Product {
  id: string; label: string; unit: string; price: number; priceNote: string;
  vatRate: number; excise: number; levies: number; leviesLabel?: string; note: string;
}

export interface SpendingFunction { id: string; label: string; plain: string; share: number }

export interface GrowthPath { from: number; to: number; value: number }
export interface PensionRates {
  retirementAge: { k: number; m: number };
  kontoRate: number; subkontoRate: number;
  lifeTableYear: number; lifeTableMinAge: number; lifeTableMaxAge: number; lifeTable: Record<string, number>;
  lifeExpectancyGainMonthsPerYear: number;
  realWageGrowth: GrowthPath[]; realValorization: GrowthPath[];
  pastRealWageGrowth: GrowthPath[]; pastRealValorization: GrowthPath[];
  minimumPension: number; minimumRealGrowthShare: number; minimumStazYears: { k: number; m: number };
  averagePension: number; thirteenth: number;
  replacementForecast: { year: number; rate: number }[];
}

export interface Rates {
  meta: { year: number; asOf: string; version: string };
  sources: Record<string, SourceRef>;
  pit: PitRates; zus: ZusRates; health: HealthRates; b2b: B2BRates; wages: Wages;
  fuel: {
    petrolPrice: number; dieselPrice: number; vatRate: number; petrolExcise: number; dieselExcise: number;
    standardVatRate: number; petrolExciseStandard: number; dieselExciseStandard: number;
    petrolFuelFee: number; dieselFuelFee: number; emissionFee: number; reliefUntil: string; priceNote: string;
  };
  tobacco: { packPrice: number; perThousand: number; adValorem: number; minimumPerThousand: number; priceNote: string };
  alcohol: { spiritsPerHl: number; beerPerHlPlato: number; winePerHl: number; vodkaPrice: number; beerPrice: number; winePrice: number; vodkaRange: number[]; beerRange: number[]; wineRange: number[]; smallBottleFeePerL: number; priceNote: string };
  electricity: { exciseMwh: number; pricePerKwh: number; capacityBandsKwhYear: number[]; capacityFees: number[]; ozePerKwh: number; cogenPerKwh: number; avgKwhMonthly: number; priceRange: number[]; priceNote: string };
  local: { rtvMonthly: number; wastePerPerson: number; propertyPerM2: number; belka: number; pccRate: number };
  basket: { categories: BasketCategory[]; savingsRate: number[]; quintileIncome: number[]; year: number; avgHouseholdSize: number };
  products: Product[];
  pension: PensionRates;
  sugar: number[];
  refs: Record<string, string>;
  checks: { minWageNet: number; minWageEmployerCost: number };
  cofog: { year: number; functions: SpendingFunction[] };
  deadlines: { id: string; when: string; what: string; who: string }[];
  context: {
    population: number; populationYear: number; pensioners: number;
    govSpendingTotal: number; govSpendingYear: number; deficitPctGdp: number; deficitYear: number;
    taxToGdp: number; taxToGdpYear: number; euTaxToGdp: number;
    casFreedomDay: string; oecdWedgePl: number; oecdWedgeAvg: number; oecdYear: number;
    vatPerCapita: number; excisePerCapita: number;
  };
}
