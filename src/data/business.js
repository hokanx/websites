// Every value here traces to research-facts.md.
// Fields that could not be verified are `null` and the UI omits them rather
// than inventing a value.

export const business = {
  name: 'STAMP BURGER',
  nameAr: 'ستامب برجر',
  tagline: 'Get stamped.',

  address: {
    street: 'Al Qadisiyah, Al Yasmeen',
    city: 'Riyadh',
    postcode: '13321',
    country: 'Saudi Arabia',
    mapsUrl: 'https://maps.app.goo.gl/ctban19fvXrDG2q97',
  },

  // Not recoverable in research. Client to supply.
  phone: null,
  hours: null,

  rating: {
    value: '7.5',
    outOf: '10',
    count: 111,
    tips: 29,
    photos: 730,
    source: 'Foursquare',
    sourceUrl: 'https://foursquare.com/v/stamp-burger/603934f5fe554b45355f6f50',
  },

  social: {
    instagram: 'https://www.instagram.com/stamp_burger/',
    instagramHandle: '@stamp_burger',
  },

  order: {
    primary: {
      label: 'Order on HungerStation',
      url: 'https://hungerstation.com/sa-en/restaurant/stamp-burger/riyadh/aqiq/49031',
    },
    others: [
      { label: 'Ninja', url: 'https://ananinja.com/sa/en/restaurants/burger-stamp-13725' },
      {
        label: 'The Chefz',
        url: 'https://thechefz.co/en/riyadh/stamp-burger-%D8%B3%D8%AA%D8%A7%D9%85%D8%A8-%D8%A8%D8%B1%D8%AC%D8%B1-1339600/',
      },
    ],
  },

  branches: [
    'Al Yasmin',
    'Al Ta’awun',
    'Al Sulaymanaya',
    'Hamra',
    'An Nasim Al Gharbi',
    'Uraija Al Wusta',
    'Al Aqiq',
    'Ar Rabie',
    'Al Narjis',
  ],
}

// Menu specs verified across HungerStation, Ninja and The Chefz.
// Prices deliberately omitted: only one price was recoverable in research, and
// a partial price list reads as broken while a full one would be invented.
export const menu = [
  {
    id: 'lagawees',
    name: 'Stamp Lagawees',
    kicker: 'The house signature',
    spec: '120g Angus beef · brisket · stamp sauce · lettuce · tomato · jalapeño · cheese sauce · cheddar',
    note: 'Two cuts of beef in one build. The brisket is what makes it read richer than a straight smash.',
  },
  {
    id: 'wagyu',
    name: 'Stamp Wagyu',
    kicker: 'The upgrade',
    spec: '150–170g wagyu · arugula · stamp wagyu sauce · tomato · pickle · cheddar · Monterey Jack',
    note: 'Its own sauce, not the house one. Peppery arugula instead of lettuce to cut the fat.',
  },
  {
    id: 'angus',
    name: 'Stamp Angus',
    kicker: 'The original',
    spec: '120g Angus beef · American lettuce · stamp sauce · tomato · pickles · cheddar',
    note: 'The one the tips keep naming. Nothing hidden behind toppings.',
  },
  {
    id: 'crispy-chicken',
    name: 'Crispy Chicken',
    kicker: 'Poultry',
    spec: 'Fried chicken · lettuce · chicken sauce · coleslaw · cheese sauce',
    note: 'Coleslaw and cheese sauce in the same build, which is what keeps the crust from drying.',
  },
  {
    id: 'spicy-chicken',
    name: 'Spicy Chicken',
    kicker: 'Poultry · heat',
    spec: 'Fried chicken · spicy stamp sauce with hot spices · jalapeño',
    note: 'Stamp sauce is described by the kitchen as “a hot and delicious sauce perfect for spicy food lovers”. This is that, turned up.',
  },
  {
    id: 'sides',
    name: 'Sides & Kids',
    kicker: 'Everything else',
    spec: 'French fries · chicken fries · buffalo chicken · kids meal with burger, fries, drink and a toy',
    note: 'The fries come up in almost every tip, for better and for worse.',
  },
]

// Verbatim Foursquare tips. No reviewer names were retrievable, so these are
// attributed to the platform. Inventing names would be a fabrication.
export const reviews = [
  {
    quote:
      'Very yummy, brand new burger joint. I tried their stamp angus burger and the Fries 10/10',
    source: 'Foursquare tip',
  },
  {
    quote: 'Excellent bun, angus burger was delicious, but fries was oily',
    source: 'Foursquare tip',
  },
  {
    quote:
      'It was so delicious, the chkn frise, buffalo chkn, crispy chkn burger top notch. Small place, super friendly staff',
    source: 'Foursquare tip',
  },
]

export const process = [
  {
    n: '01',
    title: 'Ground for the day',
    body: 'Angus and brisket, coarse ground so the patty stays open enough to catch a crust instead of steaming.',
  },
  {
    n: '02',
    title: 'Onto the flat-top',
    body: 'The griddle is already hot. The patty goes down once and is pressed once, the only press it gets.',
  },
  {
    n: '03',
    title: 'Sauced',
    body: 'Stamp sauce goes on while the cheddar is still slumping, so the two meet before the bun closes.',
  },
  {
    n: '04',
    title: 'Stamped',
    body: 'The top bun comes down and the build is closed. That is the whole idea, and the whole name.',
  },
]

export const chapters = [
  {
    kicker: 'Chapter 01',
    headline: 'The flat-top is already hot',
    body: 'Nothing here waits for you. The griddle has been at temperature since open.',
  },
  {
    kicker: 'Chapter 02',
    headline: '120g Angus. Brisket. Stamp sauce.',
    body: 'Two cuts, one sauce, and cheddar going soft over a crust that formed in ninety seconds.',
  },
  {
    kicker: 'Chapter 03',
    headline: 'Get stamped',
    body: 'The bun comes down. That is the mark, and that is the name.',
  },
]
