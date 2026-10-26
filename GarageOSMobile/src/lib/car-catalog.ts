// Reference data for the make and model pickers, not domain data: the garage
// stores what the user picked as plain text in `MyVehicle.name`, so nothing
// here reaches the contract. A make missing from the list is not a dead end —
// the picker offers the typed text as a value of its own.
//
// `alias` is the Cyrillic spelling people actually type on a Ukrainian
// keyboard («мерс» for Mercedes-Benz). It is searched, never displayed.

export interface CarMake {
  name: string;
  alias: string;
  models: readonly string[];
}

export const CAR_MAKES: readonly CarMake[] = [
  { name: 'Acura', alias: 'Акура', models: ['ILX', 'Integra', 'MDX', 'NSX', 'RDX', 'RLX', 'TLX', 'ZDX'] },
  { name: 'Alfa Romeo', alias: 'Альфа Ромео', models: ['147', '156', '159', '166', '4C', 'Brera', 'Giulia', 'Giulietta', 'MiTo', 'Stelvio', 'Tonale'] },
  { name: 'Aston Martin', alias: 'Астон Мартін', models: ['DB9', 'DB11', 'DB12', 'DBS', 'DBX', 'Rapide', 'Vantage'] },
  { name: 'Audi', alias: 'Ауді', models: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'e-tron', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'R8', 'RS3', 'RS6', 'S3', 'S4', 'TT'] },
  { name: 'Bentley', alias: 'Бентлі', models: ['Bentayga', 'Continental GT', 'Flying Spur', 'Mulsanne'] },
  { name: 'BMW', alias: 'БМВ', models: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'i3', 'i4', 'iX', 'iX3', 'M3', 'M5', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4'] },
  { name: 'Buick', alias: 'Б’юїк', models: ['Enclave', 'Encore', 'Envision', 'LaCrosse', 'Regal'] },
  { name: 'BYD', alias: 'БІД', models: ['Atto 3', 'Dolphin', 'Han', 'Qin', 'Seal', 'Song', 'Tang', 'Yuan Plus'] },
  { name: 'Cadillac', alias: 'Кадилак', models: ['ATS', 'CT5', 'CT6', 'CTS', 'Escalade', 'Lyriq', 'SRX', 'XT4', 'XT5', 'XT6'] },
  { name: 'Changan', alias: 'Чанган', models: ['CS35', 'CS55', 'CS75', 'Eado', 'UNI-K', 'UNI-T'] },
  { name: 'Chery', alias: 'Чері', models: ['Amulet', 'Arrizo', 'Eastar', 'QQ', 'Tiggo 2', 'Tiggo 4', 'Tiggo 7', 'Tiggo 8'] },
  { name: 'Chevrolet', alias: 'Шевроле', models: ['Aveo', 'Bolt', 'Camaro', 'Captiva', 'Cruze', 'Epica', 'Equinox', 'Lacetti', 'Lanos', 'Malibu', 'Orlando', 'Spark', 'Tahoe', 'Trailblazer', 'Traverse', 'Volt'] },
  { name: 'Chrysler', alias: 'Крайслер', models: ['300C', 'Pacifica', 'PT Cruiser', 'Sebring', 'Town & Country', 'Voyager'] },
  { name: 'Citroen', alias: 'Сітроен', models: ['Berlingo', 'C1', 'C3', 'C3 Aircross', 'C4', 'C4 Picasso', 'C5', 'C5 Aircross', 'C-Elysee', 'Jumper', 'Jumpy', 'Nemo'] },
  { name: 'Dacia', alias: 'Дачія', models: ['Dokker', 'Duster', 'Jogger', 'Lodgy', 'Logan', 'Sandero', 'Spring'] },
  { name: 'Daewoo', alias: 'Део', models: ['Lanos', 'Leganza', 'Matiz', 'Nexia', 'Nubira', 'Sens'] },
  { name: 'Daihatsu', alias: 'Дайхацу', models: ['Materia', 'Sirion', 'Terios', 'YRV'] },
  { name: 'Dodge', alias: 'Додж', models: ['Caliber', 'Challenger', 'Charger', 'Durango', 'Journey', 'Nitro', 'RAM'] },
  { name: 'DS', alias: 'ДС', models: ['DS3', 'DS4', 'DS5', 'DS7 Crossback', 'DS9'] },
  { name: 'Ferrari', alias: 'Феррарі', models: ['296', '458', '488', 'California', 'F8', 'Portofino', 'Roma', 'SF90'] },
  { name: 'Fiat', alias: 'Фіат', models: ['500', '500L', '500X', 'Doblo', 'Ducato', 'Fiorino', 'Panda', 'Punto', 'Scudo', 'Tipo'] },
  { name: 'Ford', alias: 'Форд', models: ['B-Max', 'C-Max', 'Connect', 'Edge', 'Escape', 'Escort', 'Explorer', 'Fiesta', 'Focus', 'Fusion', 'Galaxy', 'Kuga', 'Mondeo', 'Mustang', 'Puma', 'Ranger', 'S-Max', 'Tourneo', 'Transit'] },
  { name: 'GAZ', alias: 'ГАЗ', models: ['Gazelle', 'Sobol', 'Volga'] },
  { name: 'Geely', alias: 'Джилі', models: ['Atlas', 'Coolray', 'Emgrand', 'GC6', 'Monjaro', 'Tugella'] },
  { name: 'Genesis', alias: 'Дженезіс', models: ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80'] },
  { name: 'GMC', alias: 'Джі Ем Сі', models: ['Acadia', 'Canyon', 'Sierra', 'Terrain', 'Yukon'] },
  { name: 'Great Wall', alias: 'Грейт Волл', models: ['Hover', 'Pegasus', 'Safe', 'Wingle'] },
  { name: 'Haval', alias: 'Хавал', models: ['Dargo', 'F7', 'H2', 'H6', 'H9', 'Jolion'] },
  { name: 'Honda', alias: 'Хонда', models: ['Accord', 'City', 'Civic', 'CR-V', 'CR-Z', 'e', 'Fit', 'HR-V', 'Insight', 'Jazz', 'Legend', 'Pilot', 'Prelude', 'Ridgeline'] },
  { name: 'Hummer', alias: 'Хаммер', models: ['H1', 'H2', 'H3'] },
  { name: 'Hyundai', alias: 'Хюндай', models: ['Accent', 'Creta', 'Elantra', 'Getz', 'i10', 'i20', 'i30', 'i40', 'Ioniq', 'Ioniq 5', 'ix35', 'Kona', 'Matrix', 'Santa Fe', 'Solaris', 'Sonata', 'Tucson', 'Veloster'] },
  { name: 'Infiniti', alias: 'Інфініті', models: ['EX', 'FX', 'G25', 'G35', 'M35', 'Q50', 'Q70', 'QX50', 'QX60', 'QX70', 'QX80'] },
  { name: 'Isuzu', alias: 'Ісузу', models: ['D-Max', 'MU-X', 'NPR', 'Trooper'] },
  { name: 'Jaguar', alias: 'Ягуар', models: ['E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'S-Type', 'X-Type', 'XE', 'XF', 'XJ'] },
  { name: 'Jeep', alias: 'Джип', models: ['Cherokee', 'Compass', 'Grand Cherokee', 'Patriot', 'Renegade', 'Wrangler'] },
  { name: 'Kia', alias: 'Кіа', models: ['Carens', 'Carnival', 'Ceed', 'Cerato', 'EV6', 'Forte', 'K5', 'Magentis', 'Mohave', 'Niro', 'Optima', 'Picanto', 'Pro Ceed', 'Rio', 'Sorento', 'Soul', 'Sportage', 'Stinger', 'Venga', 'XCeed'] },
  { name: 'Lada', alias: 'Лада', models: ['2101', '2107', '2109', '2110', '2114', 'Granta', 'Kalina', 'Largus', 'Niva', 'Priora', 'Samara', 'Vesta'] },
  { name: 'Lamborghini', alias: 'Ламборгіні', models: ['Aventador', 'Gallardo', 'Huracan', 'Urus'] },
  { name: 'Lancia', alias: 'Лянча', models: ['Delta', 'Musa', 'Phedra', 'Thema', 'Ypsilon'] },
  { name: 'Land Rover', alias: 'Ленд Ровер', models: ['Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'] },
  { name: 'Lexus', alias: 'Лексус', models: ['CT', 'ES', 'GS', 'GX', 'IS', 'LS', 'LX', 'NX', 'RC', 'RX', 'UX'] },
  { name: 'Lifan', alias: 'Ліфан', models: ['Breez', 'Cebrium', 'Solano', 'X50', 'X60'] },
  { name: 'Lincoln', alias: 'Лінкольн', models: ['Aviator', 'Continental', 'MKC', 'MKX', 'MKZ', 'Nautilus', 'Navigator'] },
  { name: 'Maserati', alias: 'Мазераті', models: ['Ghibli', 'GranTurismo', 'Grecale', 'Levante', 'Quattroporte'] },
  { name: 'Mazda', alias: 'Мазда', models: ['2', '3', '5', '6', '323', '626', 'BT-50', 'CX-3', 'CX-5', 'CX-7', 'CX-9', 'CX-30', 'CX-60', 'MX-5', 'MX-30', 'Premacy', 'Tribute'] },
  { name: 'Mercedes-Benz', alias: 'Мерседес', models: ['A-Class', 'B-Class', 'C-Class', 'CLA', 'CLK', 'CLS', 'E-Class', 'EQC', 'EQS', 'G-Class', 'GL', 'GLA', 'GLB', 'GLC', 'GLE', 'GLK', 'GLS', 'ML', 'S-Class', 'SL', 'SLK', 'Sprinter', 'V-Class', 'Viano', 'Vito'] },
  { name: 'MG', alias: 'ЕмДжі', models: ['3', '4', '5', 'HS', 'Marvel R', 'ZS'] },
  { name: 'Mini', alias: 'Міні', models: ['Clubman', 'Cooper', 'Countryman', 'Paceman'] },
  { name: 'Mitsubishi', alias: 'Міцубісі', models: ['ASX', 'Colt', 'Eclipse', 'Eclipse Cross', 'Galant', 'Grandis', 'L200', 'Lancer', 'Outlander', 'Pajero', 'Pajero Sport', 'Space Star'] },
  { name: 'Nissan', alias: 'Нісан', models: ['350Z', 'Almera', 'Ariya', 'Juke', 'Leaf', 'Maxima', 'Micra', 'Murano', 'Navara', 'Note', 'Pathfinder', 'Patrol', 'Primera', 'Qashqai', 'Rogue', 'Sentra', 'Terrano', 'Tiida', 'X-Trail'] },
  { name: 'Opel', alias: 'Опель', models: ['Agila', 'Antara', 'Astra', 'Combo', 'Corsa', 'Crossland', 'Grandland', 'Insignia', 'Meriva', 'Mokka', 'Movano', 'Omega', 'Signum', 'Vectra', 'Vivaro', 'Zafira'] },
  { name: 'Peugeot', alias: 'Пежо', models: ['106', '107', '108', '206', '207', '208', '301', '306', '307', '308', '406', '407', '408', '508', '2008', '3008', '5008', 'Bipper', 'Boxer', 'Expert', 'Partner', 'Rifter', 'Traveller'] },
  { name: 'Porsche', alias: 'Порше', models: ['718 Boxster', '718 Cayman', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'] },
  { name: 'Ravon', alias: 'Равон', models: ['Gentra', 'Nexia R3', 'R2', 'R4'] },
  { name: 'Renault', alias: 'Рено', models: ['Arkana', 'Austral', 'Captur', 'Clio', 'Duster', 'Espace', 'Fluence', 'Grand Scenic', 'Kadjar', 'Kangoo', 'Koleos', 'Laguna', 'Logan', 'Master', 'Megane', 'Sandero', 'Scenic', 'Symbol', 'Talisman', 'Trafic', 'Twingo', 'Zoe'] },
  { name: 'Rolls-Royce', alias: 'Роллс-Ройс', models: ['Cullinan', 'Dawn', 'Ghost', 'Phantom', 'Wraith'] },
  { name: 'Rover', alias: 'Ровер', models: ['25', '45', '75', '200', '400', '600'] },
  { name: 'Saab', alias: 'Сааб', models: ['900', '9000', '9-3', '9-5'] },
  { name: 'Seat', alias: 'Сеат', models: ['Alhambra', 'Altea', 'Arona', 'Ateca', 'Cordoba', 'Ibiza', 'Leon', 'Tarraco', 'Toledo'] },
  { name: 'Skoda', alias: 'Шкода', models: ['Citigo', 'Enyaq', 'Fabia', 'Felicia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Rapid', 'Roomster', 'Scala', 'Superb', 'Yeti'] },
  { name: 'Smart', alias: 'Смарт', models: ['Forfour', 'Fortwo', 'Roadster'] },
  { name: 'SsangYong', alias: 'Санг Йонг', models: ['Actyon', 'Korando', 'Kyron', 'Musso', 'Rexton', 'Tivoli'] },
  { name: 'Subaru', alias: 'Субару', models: ['BRZ', 'Forester', 'Impreza', 'Legacy', 'Levorg', 'Outback', 'Tribeca', 'WRX', 'XV'] },
  { name: 'Suzuki', alias: 'Сузукі', models: ['Baleno', 'Grand Vitara', 'Ignis', 'Jimny', 'Liana', 'Swift', 'SX4', 'Vitara'] },
  { name: 'Tesla', alias: 'Тесла', models: ['Cybertruck', 'Model 3', 'Model S', 'Model X', 'Model Y'] },
  { name: 'Toyota', alias: 'Тойота', models: ['4Runner', 'Auris', 'Avalon', 'Avensis', 'Aygo', 'bZ4X', 'Camry', 'C-HR', 'Corolla', 'Corolla Cross', 'Highlander', 'Hilux', 'Land Cruiser', 'Land Cruiser Prado', 'Previa', 'Prius', 'Proace', 'RAV4', 'Sequoia', 'Sienna', 'Tundra', 'Venza', 'Yaris'] },
  { name: 'UAZ', alias: 'УАЗ', models: ['Hunter', 'Patriot', 'Pickup', '452'] },
  { name: 'Volkswagen', alias: 'Фольксваген', models: ['Amarok', 'Arteon', 'Beetle', 'Bora', 'Caddy', 'California', 'Caravelle', 'Crafter', 'Golf', 'ID.3', 'ID.4', 'ID.5', 'Jetta', 'Multivan', 'Passat', 'Polo', 'Scirocco', 'Sharan', 'Taos', 'T-Cross', 'Tiguan', 'T-Roc', 'Touareg', 'Touran', 'Transporter', 'Up'] },
  { name: 'Volvo', alias: 'Вольво', models: ['C30', 'C40', 'S40', 'S60', 'S80', 'S90', 'V40', 'V50', 'V60', 'V90', 'XC40', 'XC60', 'XC70', 'XC90'] },
  { name: 'ZAZ', alias: 'ЗАЗ', models: ['Forza', 'Lanos', 'Sens', 'Slavuta', 'Tavria', 'Vida'] },
];

export const MAKE_NAMES: readonly string[] = CAR_MAKES.map((make) => make.name);

const BY_NAME = new Map(CAR_MAKES.map((make) => [make.name.toLowerCase(), make]));

export function modelsOf(make: string): readonly string[] {
  return BY_NAME.get(make.trim().toLowerCase())?.models ?? [];
}

// Matches the Latin name and the Cyrillic alias, so «мерс» and «merc» both
// reach Mercedes-Benz. Only makes carry an alias: models are typed as written.
export function makeMatches(make: string, query: string): boolean {
  const found = BY_NAME.get(make.toLowerCase());

  return (
    make.toLowerCase().includes(query) || (found?.alias.toLowerCase().includes(query) ?? false)
  );
}

// Longest make first, so «Land Rover Discovery» does not match a hypothetical
// «Land». Returns empty strings when the name was not written by the pickers —
// a vehicle saved before this screen existed, or one typed by hand.
export function splitVehicleName(name: string): { make: string; model: string } {
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  const found = [...CAR_MAKES]
    .sort((a, b) => b.name.length - a.name.length)
    .find(
      (make) =>
        lower === make.name.toLowerCase() || lower.startsWith(`${make.name.toLowerCase()} `)
    );

  if (found === undefined) return { make: '', model: '' };

  return { make: found.name, model: trimmed.slice(found.name.length).trim() };
}
