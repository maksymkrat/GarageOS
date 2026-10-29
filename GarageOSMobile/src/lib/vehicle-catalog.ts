export interface VehicleMake {
  name: string;
  alias: string;
  models: readonly string[];
}

const CAR_MAKES: readonly VehicleMake[] = [
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

const MOTO_MAKES: readonly VehicleMake[] = [
  { name: 'Aprilia', alias: 'Апрілія', models: ['Dorsoduro', 'Pegaso', 'RS 125', 'RS 660', 'RSV4', 'Shiver', 'SR 150', 'Tuono 660', 'Tuono V4'] },
  { name: 'Bajaj', alias: 'Баджадж', models: ['Avenger', 'Boxer', 'Dominar 400', 'Pulsar 150', 'Pulsar 200'] },
  { name: 'Bashan', alias: 'Башан', models: ['BS200', 'BS250', 'BS250-11'] },
  { name: 'Benelli', alias: 'Бенеллі', models: ['302S', 'Imperiale 400', 'Leoncino 500', 'TNT 25', 'TRK 502'] },
  { name: 'Beta', alias: 'Бета', models: ['RR 125', 'RR 250', 'RR 300', 'RR 350', 'Xtrainer'] },
  { name: 'BMW', alias: 'БМВ', models: ['C 400 X', 'F 650 GS', 'F 750 GS', 'F 800 GS', 'F 850 GS', 'G 310 GS', 'G 310 R', 'K 1600 GTL', 'R 1200 GS', 'R 1250 GS', 'R nineT', 'S 1000 RR', 'S 1000 XR'] },
  { name: 'Can-Am', alias: 'Кен-Ем', models: ['Maverick', 'Outlander', 'Renegade', 'Ryker', 'Spyder'] },
  { name: 'CFMoto', alias: 'СіЕфМото', models: ['150NK', '250NK', '400NK', '650MT', '650NK', '700CL-X', '800MT'] },
  { name: 'Daelim', alias: 'Деїлім', models: ['Daystar', 'Roadwin', 'VJF 250'] },
  { name: 'Dnepr', alias: 'Дніпро', models: ['K-750', 'MT-10', 'MT-11', 'MT-16'] },
  { name: 'Ducati', alias: 'Дукаті', models: ['Diavel', 'Hypermotard', 'Monster', 'Multistrada', 'Panigale V2', 'Panigale V4', 'Scrambler', 'Streetfighter', 'SuperSport'] },
  { name: 'Forte', alias: 'Форте', models: ['FT125', 'FT150', 'FT200', 'FT250', 'Alpha'] },
  { name: 'GasGas', alias: 'ГазГаз', models: ['EC 250', 'EC 300', 'ES 700', 'MC 250'] },
  { name: 'Geon', alias: 'Геон', models: ['CR6', 'Dakar', 'Issen', 'Pantera', 'Stinger', 'Terra-X', 'X-Ride', 'X-Road'] },
  { name: 'Harley-Davidson', alias: 'Харлей', models: ['Fat Boy', 'Forty-Eight', 'Heritage', 'Iron 883', 'Pan America', 'Road Glide', 'Road King', 'Softail', 'Sportster 883', 'Sportster 1200', 'Street 750', 'Street Glide'] },
  { name: 'Honda', alias: 'Хонда', models: ['Africa Twin', 'CB125', 'CB500', 'CB650R', 'CBR125R', 'CBR600RR', 'CBR1000RR', 'CRF250L', 'CRF450R', 'Dio', 'Forza', 'Gold Wing', 'Lead', 'PCX', 'Rebel 500', 'Shadow', 'Tact', 'Transalp', 'Varadero', 'X-ADV'] },
  { name: 'Husqvarna', alias: 'Хускварна', models: ['FC 450', 'FE 350', 'Norden 901', 'Svartpilen 401', 'TE 300', 'Vitpilen 401'] },
  { name: 'Hyosung', alias: 'Хьосунг', models: ['Aquila 250', 'Aquila 650', 'GT250', 'GT650'] },
  { name: 'IZH', alias: 'Іж', models: ['Jupiter', 'Planeta', 'Planeta Sport', '49'] },
  { name: 'Jawa', alias: 'Ява', models: ['350', '350 OHC', '638', '640'] },
  { name: 'Kawasaki', alias: 'Кавасакі', models: ['KLX250', 'KX250F', 'Ninja 250', 'Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Versys 650', 'Vulcan S', 'Z400', 'Z650', 'Z750', 'Z800', 'Z900', 'Z1000'] },
  { name: 'KTM', alias: 'КТМ', models: ['125 Duke', '200 Duke', '250 Duke', '390 Duke', '690 Duke', '790 Adventure', '790 Duke', '890 Adventure', '890 Duke', '1290 Super Adventure', '1290 Super Duke', 'EXC 250', 'EXC 300', 'EXC-F 350', 'RC 390', 'SX-F 450'] },
  { name: 'Kymco', alias: 'Кімко', models: ['Agility', 'AK 550', 'Downtown', 'Like', 'People', 'Xciting'] },
  { name: 'Lifan', alias: 'Ліфан', models: ['KP150', 'KP200', 'KPR200', 'KPT200', 'LF200'] },
  { name: 'Loncin', alias: 'Лонсін', models: ['CR4', 'CR5', 'GP250', 'LX200', 'LX250'] },
  { name: 'Minsk', alias: 'Мінськ', models: ['3.112', 'C4 250', 'D4 125', 'X250'] },
  { name: 'Moto Guzzi', alias: 'Мото Гуцці', models: ['Breva', 'California', 'Griso', 'V7', 'V9', 'V85 TT'] },
  { name: 'Musstang', alias: 'Мустанг', models: ['MT150', 'MT200', 'MT250', 'Region'] },
  { name: 'MV Agusta', alias: 'МВ Агуста', models: ['Brutale 800', 'Dragster', 'F3', 'F4', 'Turismo Veloce'] },
  { name: 'Peugeot', alias: 'Пежо', models: ['Django', 'Kisbee', 'Speedfight', 'Tweet'] },
  { name: 'Piaggio', alias: 'Піаджо', models: ['Beverly', 'Liberty', 'Medley', 'MP3', 'Zip'] },
  { name: 'Polaris', alias: 'Поларіс', models: ['Ranger', 'RZR', 'Scrambler', 'Sportsman'] },
  { name: 'QJMotor', alias: 'КюДжей', models: ['SRK 400', 'SRT 700', 'SRV 550'] },
  { name: 'Royal Enfield', alias: 'Роял Енфілд', models: ['Classic 350', 'Continental GT 650', 'Himalayan', 'Interceptor 650', 'Meteor 350'] },
  { name: 'Segway', alias: 'Сегвей', models: ['Fugleman', 'Snarler', 'Villain'] },
  { name: 'Sherco', alias: 'Шерко', models: ['SE 250', 'SE 300', 'SEF 450'] },
  { name: 'Shineray', alias: 'Шинерей', models: ['Elcrosso 400', 'X-Trail 200', 'XY200', 'XY250'] },
  { name: 'Simson', alias: 'Сімсон', models: ['S50', 'S51', 'Schwalbe'] },
  { name: 'Spark', alias: 'Спарк', models: ['SP125C', 'SP150', 'SP200', 'SP250'] },
  { name: 'Suzuki', alias: 'Сузукі', models: ['Address', 'Bandit 600', 'Bandit 1200', 'Burgman', 'DL650 V-Strom', 'DL1000 V-Strom', 'DR-Z400', 'GSX-R600', 'GSX-R750', 'GSX-R1000', 'GSX-S750', 'Intruder', "Let's", 'RM-Z250', 'SV650'] },
  { name: 'SYM', alias: 'Сім', models: ['Cruisym', 'Fiddle', 'Jet 14', 'Joyride', 'Symphony'] },
  { name: 'Triumph', alias: 'Тріумф', models: ['Bonneville T100', 'Bonneville T120', 'Rocket 3', 'Scrambler 1200', 'Speed Triple', 'Street Triple', 'Tiger 800', 'Tiger 900', 'Tiger 1200', 'Trident 660'] },
  { name: 'TVS', alias: 'ТіВіЕс', models: ['Apache RTR 160', 'Apache RTR 200', 'Ntorq', 'Raider'] },
  { name: 'Ural', alias: 'Урал', models: ['Gear Up', 'M-72', 'Ranger', 'Solo sT'] },
  { name: 'Vespa', alias: 'Веспа', models: ['GTS 300', 'LX 125', 'Primavera', 'Sprint'] },
  { name: 'Viper', alias: 'Вайпер', models: ['Active', 'F2', 'Storm', 'V150', 'V200', 'V250', 'ZS150'] },
  { name: 'Voge', alias: 'Воге', models: ['300AC', '300R', '500DS', '500R', '525DSX', '650DS'] },
  { name: 'Yamaha', alias: 'Ямаха', models: ['Aerox', 'Drag Star', 'FZ1', 'FZ6', 'Jog', 'MT-03', 'MT-07', 'MT-09', 'MT-125', 'NMAX', 'Tenere 700', 'TMAX', 'Virago', 'WR250F', 'XJ6', 'XMAX', 'XT660', 'YZ250F', 'YZF-R1', 'YZF-R3', 'YZF-R6', 'YZF-R125'] },
  { name: 'Zongshen', alias: 'Зонгшен', models: ['RX3', 'Z-One', 'ZS200', 'ZS250'] },
  { name: 'Zontes', alias: 'Зонтес', models: ['125U', '155U', '310R', '310T', '350X'] },
];

export interface MakeCatalog {
  readonly names: readonly string[];
  models(make: string): readonly string[];
  matches(make: string, query: string): boolean;
  fields(name: string): { make: string; model: string };
}

function buildCatalog(makes: readonly VehicleMake[]): MakeCatalog {
  const byName = new Map(makes.map((make) => [make.name.toLowerCase(), make]));

  const byLength = [...makes].sort((a, b) => b.name.length - a.name.length);

  return {
    names: makes.map((make) => make.name),

    models(make) {
      return byName.get(make.trim().toLowerCase())?.models ?? [];
    },

    matches(make, query) {
      const found = byName.get(make.toLowerCase());

      return (
        make.toLowerCase().includes(query) || (found?.alias.toLowerCase().includes(query) ?? false)
      );
    },

    fields(name) {
      const trimmed = name.trim();
      const lower = trimmed.toLowerCase();

      const found = byLength.find(
        (make) =>
          lower === make.name.toLowerCase() || lower.startsWith(`${make.name.toLowerCase()} `)
      );

      if (found === undefined) return { make: trimmed, model: '' };

      return { make: found.name, model: trimmed.slice(found.name.length).trim() };
    },
  };
}

const CAR_CATALOG = buildCatalog(CAR_MAKES);

const MOTO_CATALOG = buildCatalog(MOTO_MAKES);

export const VEHICLE_KINDS = ['Авто', 'Мото', 'Техніка'];

const CATALOGS: Record<string, MakeCatalog | undefined> = {
  Авто: CAR_CATALOG,
  Мото: MOTO_CATALOG,
};

export function catalogFor(kind: string): MakeCatalog | undefined {
  return CATALOGS[kind];
}

export const EARLIEST_YEAR = 1900;

export function latestYear(): number {
  return new Date().getFullYear() + 1;
}

export function vehicleYears(): string[] {
  const years: string[] = [];

  for (let year = latestYear(); year >= EARLIEST_YEAR; year -= 1) years.push(String(year));

  return years;
}
