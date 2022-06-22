DROP DATABASE IF exists avto_delavnica;

CREATE DATABASE IF NOT EXISTS avto_delavnica;

use avto_delavnica;


CREATE TABLE IF NOT EXISTS user_roles (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    street VARCHAR(50) NOT NULL,
    street_number varchar(10) NOT NULL,
    zipcode INT NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS car_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    isLicenced TINYINT NOT NULL,
    maxCapacity INT NOT NULL,
    isAllowed TINYINT DEFAULT 0,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(255),
    password VARCHAR(255),
    facebook_id varchar(100),
    twitter_id varchar(100),
    google_id varchar(100),
    role_id INT NOT NULL DEFAULT 1,
    address_id INT DEFAULT NULL,
    car_service_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (car_service_id) REFERENCES car_services(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    text VARCHAR(500) NOT NULL,
    isAdvice TINYINT DEFAULT 0,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    text VARCHAR(500) NOT NULL,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS manufacturers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    model VARCHAR(100) NOT NULL,
    manufactured_year YEAR NOT NULL,
    manufacturer_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS offered_services(
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    car_service_id INT NOT NULL,
    description VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (car_service_id) REFERENCES car_services(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE favorite_dealerships(
    id int PRIMARY KEY AUTO_INCREMENT,
    car_service_id int not null,
    user_id int not null,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN key(car_service_id) REFERENCES car_services(id) on delete cascade on update cascade,
    FOREIGN KEY(user_id) REFERENCES users(id) on delete cascade on update cascade
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_date DATETIME NOT NULL,
    user_id INT,
    offered_service_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (offered_service_id) REFERENCES offered_services(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ratings(
    id INT PRIMARY KEY AUTO_INCREMENT,
    text VARCHAR(500) NOT NULL,
    rating INT NOT NULL,
    offered_service_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (offered_service_id) REFERENCES offered_services(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    price INT NOT NULL,
    offered_service_id INT NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (offered_service_id) REFERENCES offered_services(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO user_roles (name) VALUES ('user');

INSERT INTO user_roles (name) VALUES ('expert');

INSERT INTO user_roles (name) VALUES ('moderator');

INSERT INTO user_roles (name) VALUES ('admin');

INSERT INTO
    addresses (street, street_number, zipcode, city, country)
VALUES
    ("Goriska cesta", "20", 3320, "Velenje", "Slovenija"),
    ("Saleska cesta", "15", 3320, "Velenje", "Slovenija"),
    ("Silihova ulica", "3", 3310, "Zalec", "Slovenija"),
    ("Robova ulica", "15", 3000, "Celje", "Slovenija"),
    ("Grunova ulica", "4", 3000, "Celje", "Slovenija"),
    (
        "Mariborska cesta",
        "119",
        3000,
        "Celje",
        "Slovenija"
    ),
    (
        "Medvedova ulica",
        "45",
        2000,
        "Maribor",
        "Slovenija"
    ),
    ("Ekartova ulica", "44", 2000, "Maribor", "Slovenija"),
    ("Ptujska cesta", "132", 2000, "Maribor", "Slovenija"),
    (
        "Bravnicarjeva ulica",
        "5",
        1000,
        "Ljubljana",
        "Slovenija"
    ),
    ("ulica 15. maja", "26", 6000, "Koper", "Slovenija"),
    ("Rozmanova ulica", "17", 6000, "Koper", "Slovenija"),
    ("Levceva ulica", "5", 1000, "Ljubljana", "Slovenija"),
    (
        "Vevska cesta",
        "17a",
        1260,
        "Ljubljana-polje",
        "Slovenija"
    ),
    ("Novi dom", "59", 1420, "Trbovlje", "Slovenija");

INSERT INTO
    car_services (
        name,
        isLicenced,
        maxCapacity,
        phone,
        email,
        address_id
    )
VALUES
    (
        "PSC Praprotnik, d.o.o.",
        true,
        10,
        "038983220",
        "prodaja@pscpraprotnik.si",
        2
    ),
    (
        "Avtohisa Selmar",
        true,
        20,
        "034244000",
        "info@selmar.si",
        6
    ),
    (
        "AVTO TRIGLAV Maribor",
        true,
        60,
        "",
        "info@avto-triglav.si",
        9
    ),
    (
        "Mercedes-Benz",
        true,
        30,
        "024600123",
        "info@mercedes-benz.si",
        9
    ),
    (
        "Porsche Ljubljana",
        true,
        100,
        "015825300",
        "porsche.ljubljana@porsche.si",
        10
    ),
    (
        "Avtoplus d.o.o. Koper-Mercedes",
        true,
        20,
        "056137000",
        "info@avtoplus.si",
        11
    );

INSERT INTO
    services (name)
VALUES
    ("Zamenjava olja"),
    ("Popravila zavor"),
    ("Popravila podvozja"),
    ("Popravila avtomobilskih klopov"),
    ("Napredni pregledi"),
    ("Zamenjava pnevmatik"),
    ("Hitri servis"),
    ("Mali servis"),
    ("Veliki servis");

INSERT INTO
    users (
        firstname,
        lastname,
        phone,
        email,
        password,
        role_id,
        address_id,
        car_service_id
    )
VALUES
    (
        "Miha",
        "Pinter",
        "051234567",
        "miha.pinter@gmail.com",
        "a91a68392173d5fcd3a15a9e7420734f",
        2,
        4,
        2
    ),
    #1
    (
        "Klara",
        "Bajc",
        "070978465",
        "klara.bajc@gmail.com",
        "8e5edadc924b6373d0b659dcf80bb0a3",
        1,
        3,
        null
    ),
    #2
    (
        "Lojz",
        "Ciglar",
        "041490808",
        "lojz.ciglar@gmail.com",
        "6e6186339f5940eb8af1dede896c1263",
        1,
        7,
        null
    ),
    #3
    (
        "Peter",
        "Cerin",
        "069254653",
        "peter.cerin@gmail.com",
        "c249fd72e38bf2b1744ad843817892d8",
        3,
        null,
        null
    ),
    #4
    (
        "Gregor",
        "Didek",
        "070265748",
        "gregor.didek@hotmail.com",
        "0dc4f212c6cad4f8d94266fbe95e3339",
        1,
        8,
        null
    ),
    #5
    (
        "Helena",
        "Ferlih",
        "069102945",
        "helena.ferlih@gmail.com",
        "3db9abc0c871453ccaac961da844b484",
        1,
        null,
        null
    ),
    #6
    (
        "Simon",
        "Goler",
        "051903784",
        "simon.goler@gmail.com",
        "eeefc800ff72746d9b4a6b45b4bb1d1d",
        2,
        1,
        2
    ),
    #7
    (
        "David",
        "Habe",
        "041344429",
        "david.habe@hotmail.com",
        "7c473c428dc1c9499965136a932f1c1c",
        4,
        12,
        null
    ),
    #8
    (
        "Sabrina",
        "Jerin",
        "070164632",
        "sabrina.jerin@gmail.com",
        "25553ac24715c3e71adfdeb150a72c6d",
        1,
        15,
        null
    ),
    #9
    (
        "Klemen",
        "Majcen",
        "069485007",
        "klemen.majcen@yahoo.com",
        "cd7372bb379370663ab768e80d0fb659",
        2,
        null,
        3
    ),
    #10
    (
        "Joze",
        "Repnik",
        "051384091",
        "joze.repnik@gmail.com",
        "1f23222bc13dfe49b40194764275289a",
        2,
        null,
        1
    ),
    #11
    (
        "Alen",
        "Belic",
        "051",
        "alenbelic@yahoo.com",
        "df60384923fc37abf5af824b3f6a1115",
        1,
        null,
        null
    ),
    #12
    (
        "Leon",
        "Arih",
        "069",
        "leonarih@gmail.com",
        "5986c597e51809c87da904d8c867c08e",
        1,
        null,
        null
    ),
    #13
    (
        "Erik",
        "Ciglar",
        "069",
        "erikciglar@gmail.com",
        "bef2bd54c50a84960e8475b961585ed0",
        1,
        null,
        null
    ),
    #14
    (
        "Ana",
        "Krajnc",
        "041",
        "ana.krajnc@hotmail.com",
        "8067b9ea3ced433e666aacfc867e0e04",
        1,
        null,
        null
    ),
    #15
    (
        "Damir",
        "Fister",
        "070",
        "damirfister@gmail.com",
        "ec5c195ebd28ada12cc5657f74d86dbe",
        1,
        null,
        null
    ),
    #16
    (
        "Denis",
        "Gorenc",
        "041",
        "denisgorenc@gmail.com",
        "d621c6397c7af9a33644a844b7dfd8f4",
        1,
        null,
        null
    ),
    #17
    (
        "Blaz",
        "Grad",
        "070",
        "blaz.grad@gmail.com",
        "502c5b4467122db7f9bd470da480c843",
        1,
        null,
        null
    );

#18


INSERT INTO
    posts (title, text,isAdvice, user_id)
VALUES
    (
        "Odpoved racunalnika",
        "Pozdravljeni, imam probleme z racunalnikom pri avtomobilu FIat Tipo 2012 letnik. Dogaja se da se pri vklopu avta razunalnik ustavi in izpise napako pri potnem racunalniku.",
        1,
        9
    ),
    (
        "Problemi z menjalnikom",
        "Fiat punto 2004, avto ime 210 000 prevozenih kilometrov, pogosto servisiran. Pri avtu se doagaja da ko spreminjam iz 3 v 4 hitrost avto se zacne cudno obnasat in se zacne zvisevat temperaturo. Ali ta napaka zahteva spremebo menjalnika?",
        1,
        5
    ),
    (
        "Stresno okno se ne odpira",
        "Spostovani, pri skodi superb 2015 letnik mi se ustavi stresno okno ko se odpira. Okno se odpre 10 cm in po tem se ustavi in pusca zvoke kot da neku udara po oknu. Kaj je mozna okvara v tem primeru?",
        1,
        6
    ),
    (
        "Servis pri GTV 1999",
        "Potrebujem velikega servisa za alfa romeo GTV 1999 letnik. V tem je problem ker avto ne morem pripeljat vec kot 20 km (v Celju pa ne obstaja pooblascen alfa romeo servis, kje je najbliza lokacija in koliko bi stalo?)",
        0,
        4
    ),
    (
        "Sprememba zavor na BMW-ju",
        "Imam probleme pri desni zavori na BMW M4 2021. Zavora se prevec segreva in ne bremza kot druga. problem nastaja pri zamenjavi ker ne najdem originalne zaovre za m-sport opremo. Ali v Sloveniji obstaja servis kateri zamenja originalne dele?",
        0,
        8
    );

INSERT INTO
    responses (text, post_id, user_id)
VALUES
    (
        "Spostovana Sabrina, pri modelu Tipo 2012 se dogajajo problemi z racunalnikom. take napake se ponavadi popravljajo z podrobnim pregledom racunalnika v nasem servisu.",
        1,
        10
    ),
    (
        "Pozdravljeni, pri starejših avtomobilih se dogajajo okvare na menjalniku, priporocamo podrobni pregled menjalnika. V celju ne obstaja pooblascen servis prioprocamo da pirpeljete avto, ce avta ne morete pripeljati obstaja nasa vlecna sluzba za informacije nas poklicite.",
        2,
        10
    ),
    (
        "Ce ja imam zavarovanje v vasem servisu ali je vlecna sluzba zracunata v zavarovanje?",
        2,
        5
    ),
    (
        "Ne zal vlecna sluzba ni zracunata v zavarovanje.",
        2,
        10
    ),
    (
        "Spostovani, mozno je da se pri stresnem oknu preneha delovanje motorja, ce na avtu imate podaljsano garancijo, lahko avto pripeljeta v nas ali druge pooblascene skoda servise.",
        3,
        11
    ),
    (
        "Koliko casa traja popravilo v vasem servisu?",
        3,
        6
    ),
    ("Popravilo traja od 2 do 5 dni.", 3, 11),
    (
        "Spostovani, originalne zavore se lahko narocajo v vseh pooblascenih servisih BMW, servisi tudi opravljajo in zamenjavo. V primeru da imate garancijo, zamenjava in del je brzplacno.",
        5,
        7
    );

INSERT INTO
    manufacturers (name)
VALUES
    ("Audi"),
    ("Mercedes"),
    ("Alfa Romeo"),
    ("Skoda"),
    ("Fiat"),
    ("BMW");

INSERT INTO
    cars (model, manufactured_year, manufacturer_id, user_id)
VALUES
    ("A6", '2011', 1, 2),
    ("Tipo", '2012', 5, 9),
    ("GTV", '1999', 3, 4),
    ("Punto", '2004', 5, 5),
    ("M4", '2021', 6, 8),
    ("Superb", '2015', 4, 6),
    ("Octavia", '2016', 4, 3);


INSERT INTO
    offered_services (service_id, car_service_id, description)
VALUES
    (1, 1, "......"),
    (1, 2, "Glaven razlog ,zakaj je potrebno motorno olje menjati na vsakih 15.000 do 20.000 prevoženih kilometrov, je v sistemu delovanja motorja.  Povprečen voznik avtomobila se večinoma vozi na kratke razdalje, motor pa je najbolj obremenjen, ko je hladen. Takrat prihaja do čezmerne obrabe mehanskih delov."),
    (1, 3, "Menjava olja v avtu spada v sklop hitri servis in redno vzdrževanje avtomobila. Menjava motornega olja je izredno pomembna, saj s tem podaljšujemo življenjsko dobo samega vozila. Redni avtoservis tako zagotavlja, da bo vaš avto optimalno pripravljen na vožnjo, hkrati pa tudi varen. Ker želimo, da vozilo služi svojemu namenu in se na cesti počutite varno, vam nudimo kakovostno avtoservis storitev."),
    (1, 4, "Prav enako pomembna pa je tudi menjava oljnega filtra in nenazadnje kvaliteta oljnega filtra. Kvaliteten filter ima namreč ravno prav velike luknjice, da zaustavi delce a hkrati ne ovira pretoka, ki je pomemben za pritisk na mazalnih mestih. Ob vsaki menjavi olja je priporočljiva menjava tudi oljnega filtra."),
    (1, 5, "Ker želimo, da vozilo služi svojemu namenu in se na cesti počutite varno, vam nudimo kakovostno avtoservis storitev, pri kateri so v uporabi le kvalitetni nadomestni deli. Ne pustite se zavesti avtoservisom, ki ponujajo poceni ponaredke in tako tvegate svojo varnost v prometu!"),
    (2, 1, "Ko začnejo vaše zavore oddajati škripajoč, škripajoč ali kovinski zvok, to pomeni, da so se obrabile skozi torni material na vaših zavornih ploščicah in se zdaj drgnejo neposredno ob vaše rotorje. To lahko začne poškodovati in upogibati vaše rotorje, kar vodi do tresenja volana, neučinkovitega ustavljanja in škripajočega zaviranja. Zamenjava zavornih ploščic in rotorjev je veliko dražja od zamenjave."),
    (2, 2, "Če opazite, da vaše vozilo ni tako učinkovito pri upočasnjevanju ali ustavljanju, kot je bilo včasih, je to ključni znak, da potrebujete servis zavor. Čas, potreben, da se vaš avto upočasni ali ustavi, je lahko odvisen od zdravja vaših pnevmatik, velikosti vašega vozila, razmer na cesti, pritiska, ki ga uporabljate, zdravja vaših zavor in še več."),
    (2, 3, "Ko se prižge opozorilna lučka zavore, je to jasen znak, da boste morda potrebovali servis. Vaša zavorna luč je lahko načrtovana za rutinska obvestila ali aktivno spremljanje in poročanje o težavah z zdravjem vaših zavor. Če pa vaš avto meri vašo potrebno zavoro po prevoženih kilometrih, je morda netočno. Če vozite na dolge razdalje z minimalnim ustavljanjem, se bodo vaše zavore manj obrabile kot voznik v mestu"),
    (2, 4, "Čeprav lahko domnevate, da je težava z zaviranjem znak potrebne zamenjave zavornih ploščic, je vaš zavorni sistem nekoliko bolj zapleten. Več različnih delov in sistemov deluje skupaj za varno upočasnitev in zaustavitev vašega vozila. Tukaj je pogled na običajne zavorne storitve, ki jih boste morda potrebovali za odpravo težav z zaviranjem."),
    (2, 5, "Vaše sprednje zavorne ploščice pogosto prevzamejo najmočnejše udarce v vaš zavorni sistem, kar pomeni, da zahtevajo pogosto nego."),
    (2, 6, "Glede na vrsto vašega vozila vaše zadnje zavorne ploščice pogosto ne delujejo tako močno kot sprednje zavorne ploščice; vendar so še vedno bistveni za vaše vozilo in jih je treba redno menjati."),
    (3, 1, "Preventivni pregled podvozja in pravilna nastavitev elementov povečujejo varnost vožnje in lego na cesti.Med mnogimi drugimi okvarami na podvozju, je zanašanje vozila iz smeri vožnje težava, ki se pojavlja zelo pogosto. Za takšno obnašanje je lahko krivih več faktorjev, katere pa se razkrije šele ob strokovnem pregledu vašega vozila. Poleg bolj prijetne vožnje pa brezhibnost podvozja zmanjšuje."),
    (3, 2, "Če vožnja vašega vozila ni več tako gladka, kot je bila nekoč, ali če servo volan nima značilne natančnosti, je morda kaj narobe s servo volanskim drogom ali šasijo. Pomembno je, da se ta težava ne zadržuje, saj se bo škoda sčasoma samo poslabšala. Popravilo šasije, avtomatsko ravnanje okvirja, popravilo okvirja in servis servo volana so lahko ustrezne rešitve."),
    (3, 3, "Včasih je potrebno le manjše popravilo, da se ohišje vrne v pravilno delovanje. V drugih primerih so potrebna resnejša popravila. Tehniki bodo med pregledom vozila poskrbeli, da bodo preverili pogonsko gred vašega vozila, kardanske spoje, kardanske spoje in osi."),
    (3, 4, "Če imate težave s krmiljenjem, naj tehnik pregleda vaš servo volanski drog glede puščanja in drugih napak. Izvedejo lahko tudi spiranje servo volana in pregledajo pasove, da zagotovijo ustrezno napetost. Če ena komponenta servo volanskega sistema ne deluje tako, kot je zasnovano, je lahko zmogljivost vozila zlahka ogrožena."),
    (3, 5, "Ob prvih znakih kakršnih koli težav s krmiljenjem pripeljite svoje vozilo v lokalni center za nego avtomobilov. Zaupanja vreden tehnik bo opravil vsa potrebna popravila in poskrbel za varno in pravilno upravljanje vašega avtomobila."),
    (3, 6, "Specializirani smo za popravila šasij, vključno z okvirji, krmiljenjem in vzmetenje, motorjem, menjalnikom, diferenciali, osmi, amortizerji in oporniki in še več. Ko potrebujete popravilo podvozja za vaš BMW, MINI ali Land Rover, lahko zaupate, da vam lahko pomagajo naši posebej usposobljeni in izkušeni strokovnjaki."),
    (4, 3, "Popravilo vozila na istem sistemu, na katerem je bil razvit in izdelan, je velika razlika. Drastično zmanjša tveganje za napake v avtokleparskih delavnicah med popravili, hkrati pa izboljšuje kakovost in varnost vozila, ki ga je treba ponovno poslati na cesto."),
    (4, 2, "Filozofija avtomobolskih klopov je bila vedno deliti svoje znanje z delavci v delavnici in ne le proizvajati in prodajati opremo za ravnanje, ponujamo najboljse servisiranje"),
    (4, 5, "Avtomobolska klopov se je razvil v pol stoletja raziskav skupaj z proizvajalci originalne opreme. Takšna prizadevanja zdaj prinašajo izredno zadovoljive rezultate iz industrijske mreže."),
    (5, 1, "......"),
    (5, 5, "Pregled vozila je postopek, ki ga zahtevajo nacionalne ali podnacionalne vlade v mnogih državah, pri katerem se vozilo pregleda, da se zagotovi skladnost s predpisi, ki urejajo varnost, emisije ali oboje. Pregled se lahko zahteva ob različnih časih, na primer občasno ali ob prenosu lastninske pravice na vozilo. Nudimo najbolj edinstveno in najbolj zahtevno analizo vašega avtomobila."),
    (6, 5, "Številne pnevmatike bo treba zamenjati pred 10. letom starosti zaradi rutinske obrabe tekalne plasti in drugih pogojev, kot so predrtine, poškodbe zaradi udarcev, nepravilno polnjenje, preobremenitev in drugo."),
    (7, 1, "Izraz 'HITRI SERVIS' sam označuje storitev, ki je hitra in hitrejša, ki jo je mogoče začeti in izvajati le z 'HITRO SERVISANJE MINDSET'' v poprodajnem osebju v današnjem težkem avtomobilskem poprodajnem okolju. Ker kupec avtomobil nenehno uporablja, je zelo pomemben redni servis in vzdrževanje"),
    (7, 3, "Za ohranjanje dosledne vozne zmogljivosti in varnosti ne glede na čas in denar kupca, kar je zelo pomembno pri današnjem poprodajnem vzdrževanju avtomobilov. Za npr. opravite preprosta opravila, kot so menjava olja, menjava zavornih ploščic, menjava pogonskega jermena, zamenjava baterije in pnevmatik ter redno vzdrževanje"),
    (7, 4, "Upoštevajoč zahteve naročnika, dodelite ''HITRO SERVISNI BAY'', ki je potreben za delo, in naj bodo deli in oprema na voljo na območjih, ki so določena za opravljanje določenega dela."),
    (7, 5, "Da bi zmanjšali nepotrebne delovne ure, je treba delovne ure za vsak delovni proces v katerem koli sistemu vozila standardizirati in upravljati, poklicni tehnik/mehanik pa naj popravilo v vozilu izvaja v skladu s standardiziranimi urami, ne pa po lastnih urah fleksibilnosti. ."),
    (8, 1, "Avtomobilske storitve lahko na splošno razdelimo v dve kategoriji: obstajajo manjše storitve in obstajajo večje storitve. Večji servisi se običajno izvajajo vsakih trideset do petinštirideset tisoč kilometrov, manjši servisi pa se običajno izvajajo vsakih deset do petnajst tisoč kilometrov: to pa je odvisno od znamke in proizvajalca vašega vozila."),
    (8, 2, "V bistvu so manjši avtomobilski servisi na splošno precej hitri in se običajno izvajajo hitro: te posebne avtomobilske storitve običajno vključujejo le zamenjavo olja in oljnih filtrov, poleg nekaj drugih manjših opravil, ki trajajo le uro in pol. in preglede, ki jih je treba opraviti."),
    (8, 3, "Za najosnovnejše modele na najbolj konkurenčnih območjih se cene manjšega servisa v Perthu začnejo že od 140 EUR in pokrivajo široko paleto komponent, vključno z:Menjava olja in oljnega filtra,pregled jermena in ceviservis zavor in pregledi zavorne tekočine,dolivanje tekočin"),
    (8, 4, "Kot vse, še posebej stroj na kolesih s številnimi premikajočimi se mehanskimi in električnimi komponentami, je vzdrževanje ključno. Redni servisi zmanjšajo tveganje, da bi šlo kaj narobe, in prepreči nadaljnje težave na dolgi rok."),
    (8, 5, "Manjše avtomobilske storitve so osnovni pregledi in se praviloma hitro izvedejo. Podobno kot 'kdaj' je tudi 'kaj' zelo odvisno od specifikacij proizvajalca avtomobila. Vendar, kot že ime pove, so opravljene naloge manjše, na primer:"),
    (8, 6, "Ne samo, da redni servis pomeni, da vaš avto še naprej nemoteno deluje, temveč vas varuje in zmanjšuje okvare. Ne pozabite, da tudi če niste dosegli priporočene kilometrine, morate svoj avto še vedno servisirati vsako leto."),
    (9, 1, "Na cesti je nekaj voznikov, ki ne izvajajo popravila avtomobilov in preventivnega vzdrževanja, ki je potrebno za vzdrževanje svojega vozila v dobrem delovnem stanju. Morda jim je to najbolj oddaljena od misli med njihovim napornim dnevom."),
    (9, 2, "Servis manjših avtomobilov na splošno vključuje naslednje: Mejava olja in filtraServis pnevmatik - vrtenje, poravnava, uravnoteženje, zračni tlak (vključno z rezervnim), pregled in čiščenje baterije pregled vseh tekočin, filtrov, jermenov, cevi, zavor in emisijBrisalci"),
    (9, 3, "Obstajata dve glavni prednosti spremljanja vzdrževanja vozil. Prvič, vaš mehanik vam lahko sporoči, kaj se začenja obrabljati, kaj je treba takoj zamenjati in kaj izgleda dobro. Drugič, lahko samozavestno vozite svoj avto, saj veste, da imate zanesljiv in varen vir prevoza."),
    (9, 4, "Ker je največja vrsta avtomobilskih storitev, je zelo malo večjih storitev, ki jih ne pokriva. Včasih se imenuje glavni servis, zato je priporočljivo, da opravite večji servis vsakih 24 mesecev (ali 24.000 milj), namesto vašega letnega polnega servisa. Po tem časovnem okviru (ali številu kilometrov) bodo nekateri elementi vašega avtomobila verjetno obrabljeni do te mere, da jih je treba zamenjati"),
    (9, 5, "Ker je zajetih več vidikov, bo trajalo dlje od običajnega časa, ki ga potrebuje avtoservis, in bo delovalo približno 3-4 ure. Na srečo se je zagotovo splačalo čakati, saj se boste odpeljali prepričani, da vaš avto nima osnovnih težav in je v naslednjih mesecih popolnoma zdrav."),
    (9, 6, "Večji servis pregleda skoraj vsak kotiček vašega avtomobila, zato ne preseneča, da gre za dodatne stroške. Stroški vašega avtomobilskega servisa se bodo razlikovali glede na vrsto storitve in znamko vašega avtomobila, vendar boste za večjo storitev verjetno porabili več kot 200 EUR.");


INSERT INTO reservations (reservation_date,user_id,offered_service_id)
 VALUES

	('2022-5-30 13:00:00',2,2),

    ('2022-6-5 9:00:00',9,4),

    ('2022-6-5 9:00:00',9,11);

INSERT INTO
    ratings (text, rating, offered_service_id, user_id)
VALUES
    (
        "Odlicno narejeno, avto je bil pregledan in računalniške napake odpravljene v krajšem času kot je navedeno.",
        5,
        1,
        3
    ),
     (
        "Katastrofa, nisam zadovoljen, usluga mi je zamudil za 15 dni.",
        1,
        1,
        3
    ),
    
    (
        "Pripravite se, da greste v prodajalca avtomobilov. Psihično se pripravite na prihajajoče naporne prodajalce. In potem ... ne pridejo. Namesto tega dobite prijazne ljudi, ki vam ne poskušajo ničesar potiskati. so v pomoč. Poslušajo. So ustrežljivi. To je bila moja izkušnja.",
        5,
        3,
        9
    ),
    (
        "Z opravljenim delom sem zadovoljen, čeprav je trajalo veliko dlje, kot sem pričakoval.",
        3,
        6,
        5
    ),
    (
        "Hitro, pošteno in ugodno. Svoj avto sem vzel za zadnje opornike in bili so veliko cenejši kot takrat, ko sem dal narediti sprednje nekaj mesecev prej v [veliki nacionalni verigi]. Mislil sem, da imam težave z gorivom, in ko so si ogledali in ugotovili, da ni nič narobe (to je bila moja napaka), so vztrajali, da mi ni treba plačati stroškov ocene.",
        4,
        8,
        1
    ),
    (
        "Zelo priporočam to avto trgovino! Bil je zelo profesionalen, zelo koristen in imel je odlične cene. se bo zagotovo vrnil",
        5,
        11,
        6
    ),
    (
        "Imel sem čudovito izkušnjo z nakupom rabljenega vozila. Postopek je bil brez stresa in prijeten. (DN) je bil zelo temeljit in dobro obveščen. Lahko mi je našel vozilo, ki je ustrezalo mojim potrebam.",
        5,
        14,
        6
    ),
    (
        "To mehanično delavnico uporabljam že več kot 8 let. Je zelo dobro obveščen, vreden zaupanja, pošten in jasen. Izkušnje ima v mnogih znamkah. Zelo priporočam brez zadržkov.",
        5,
        16,
        8
    ),
    (
        "Moj avto je potreboval novo črpalko za gorivo. Vzel sem avto in ga popravila še isti dan. Težav ni bilo in avto je dobro delal.",
        4,
        18,
        10
    ),
    (
        "Poiskal sem v Googlu avto servis v bližini in izbral mesto zaradi dobrih ocen. Vesela sem, da sem jih izbrala, hitra prijazna postrežba. Takoj vnaprej o ceni opravljenega dela na mojem avtomobilu in podrobno zakaj. To trgovino bom priporočil vsej svoji družini v okolici.",
        4,
        21,
        1
    ),
    (
        "Zelo dobro poslovno in super prijazno osebje z različnimi storitvami. Našel sem jih prek aplikacije AAA in vsekakor bi jih priporočil vsakomur, saj so eden izmed 10 najboljših avtoservisov v mestu!",
        4,
        23,
        1
    ),
    (
        "Nisem zadovoljen s storitvijo, ki mi je bila zagotovljena.",
        1,
        24,
        5
    ),
    (
        "Najslabše mesto za popravilo avtomobila. Izogibajte se za vsako ceno.",
        2,
        25,
        6
    ),
    ("Moje popravilo je zamujalo 5 dni.", 2, 28, 4),
    (
        "Bila je hitra in prijetna izkušnja, upravitelj je bil zelo profesionalen, vljuden in v pomoč pri transakciji na vsakem koraku. Edina stvar, ki mi ni bila všeč, je bila dražja storitev kot zadnjič, menda inflacija.",
        4,
        30,
        2
    ),
    (
        "Imel sem zelo pozitivno izkušnjo. Vodja je zelo prijazen in profesionalen. Prvotna spletna ponudba je bila maksimalna, kot je bilo pričakovano, vendar je bila naslednja ponudba iz glavne pisarne med tem obiskom nižja od pričakovane, me je spodbudila k nasprotni ponudbi, za katero sem upal, da jo dobim, in je bila sprejeta. Papirologija je bila izpolnjena v razumnem času in odšel sem s čekom v približno eni uri po prihodu. Priporočam to podjetje in lokacijo.",
        5,
        32,
        7
    ),
    (
        "Kupec je vozilo v celoti pregledal. Slike so bile naložene in v 30 minutah sem prejel ponudbo, ki sem jo sprejel. Nemotena in poštena transakcija.",
        5,
        34,
        7
    ),
    ("Moje popravilo je zamujalo 3 dni.", 2, 36, 7),
    (
        "Tako sem srečen, da sem jih našel. Odzivna, komunikacija je bila nad in tako prijetna. Pravi profesionalci! Zelo priporočam.",
        5,
        37,
        9
    ),
    (
        "Odlicno narejeno, avto je bil pregledan in računalniške napake odpravljene v krajšem času kot je navedeno.",
        5,
        21,
        3
    ),
    (
        "zelo hitro in dobro narejeno, vsa priporočila.",
        5,
        1,
        12
    ),
    (
        "Zaradi gneče je bilo težko načrtovati velik servis, a so mojstri opravili odlično delo.",
        4,
        33,
        13
    ),
    (
        "Zelo hiter nakup originalnih delov, vendar sem čakal 7 dni, da sem dobil avto nazas s servisa, kar je bilo rečeno 4 dni.",
        3,
        6,
        6
    ),
    (
        "Z opravljenim delom sem zadovoljen, čeprav je trajalo veliko dlje, kot sem pričakoval.",
        3,
        38,
        5
    );

INSERT INTO
    prices (price, offered_service_id, valid_from, valid_to)
VALUES
    (40, 1, '2022-1-1', '2022-6-1'),
    (45, 2, '2022-2-1', null),
    (45, 3, '2022-3-25', '2022-7-20'),
    (37, 4, '2022-1-1', null),
    (38, 5, '2022-1-1', null),
    (100, 6, '2022-1-1', '2022-12-31'),
    (90, 7, '2022-2-1', null),
    (95, 8, '2022-3-1', null),
    (98, 9, '2022-1-1', null),
    (110, 10, '2022-3-20', '2022-7-20'),
    (105, 11, '2022-1-1', '2022-12-31'),
    (70, 12, '2022-2-1', null),
    (75, 13, '2022-3-20', null),
    (75, 14, '2022-1-1', null),
    (75, 15, '2022-1-1', null),
    (80, 16, '2022-5-10', '2022-10-4'),
    (65, 17, '2022-1-1', null),
    (50, 18, '2022-1-1', null),
    (52, 19, '2022-3-1', null),
    (60, 20, '2022-4-10', '2022-12-10'),
    (300, 21, '2022-1-1', '2022-6-1'),
    (320, 22, '2022-1-1', '2022-12-31'),
    (60, 23, '2022-1-1', null),
    (45, 24, '2022-4-1', null),
    (30, 25, '2022-1-1', null),
    (35, 26, '2022-3-1', '2022-9-1'),
    (45, 27, '2022-5-3', null),
    (80, 28, '2022-3-1', null),
    (85, 29, '2022-1-1', null),
    (75, 30, '2022-2-10', '2022-7-10'),
    (70, 31, '2022-3-20', null),
    (85, 32, '2022-1-1', null),
    (90, 33, '2022-3-5', '2022-9-5'),
    (200, 34, '2022-1-1', null),
    (210, 35, '2022-1-1', null),
    (250, 36, '2022-2-1', null),
    (180, 37, '2022-1-1', null),
    (190, 38, '2022-3-5', null),
    (200, 39, '2021-10-1', '2022-10-1');