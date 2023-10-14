import db from '../connection.js';

async function seed() {
  try {
    await db.query('DROP TABLE IF EXISTS "Adoption";');
    await db.query('DROP TABLE IF EXISTS "Pet";');
    await db.query('DROP TABLE IF EXISTS "Address";');
    await db.query('DROP TABLE IF EXISTS "Shelter";');
    await db.query('DROP TABLE IF EXISTS "User";');

    await db.query(`
      CREATE TABLE "User" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3),
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "about" TEXT NOT NULL,
        "url_photo" TEXT,
        "phone" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "active" BOOLEAN NOT NULL DEFAULT true,
    
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `);

    await db.query(`
      CREATE TABLE "Shelter" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3),
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "about" TEXT NOT NULL,
        "active" BOOLEAN NOT NULL DEFAULT true,
    
        CONSTRAINT "Shelter_pkey" PRIMARY KEY ("id")
      );
    `);

    await db.query(`
      CREATE TABLE "Address" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3),
        "number" TEXT NOT NULL,
        "postcode" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "country" TEXT,
        "user_id" INTEGER,
        "shelter_id" INTEGER,
    
        CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
      ); 
    `);

    await db.query(`
      CREATE TABLE "Pet" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3),
        "url_photo" TEXT NOT NULL,
        "age" TIMESTAMP(3) NOT NULL,
        "description" TEXT NOT NULL,
        "available" BOOLEAN NOT NULL,
        "name" TEXT NOT NULL,
        "shelter_id" INTEGER NOT NULL,
    
        CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
      );
    `);

    await db.query(`
      CREATE TABLE "Adoption" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3),
        "date" TIMESTAMP(3) NOT NULL,
        "user_id" INTEGER,
        "pet_id" INTEGER NOT NULL,
    
        CONSTRAINT "Adoption_pkey" PRIMARY KEY ("id")
      ); 
    `);

    await db.query(`
      CREATE UNIQUE INDEX "Address_user_id_key" ON "Address"("user_id");
    `);

    await db.query(`
      CREATE UNIQUE INDEX "Address_shelter_id_key" ON "Address"("shelter_id");
    `);

    await db.query(`
      CREATE UNIQUE INDEX "Adoption_pet_id_key" ON "Adoption"("pet_id");
    `);

    await db.query(`
      ALTER TABLE "Address" ADD CONSTRAINT "Address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);

    await db.query(`
      ALTER TABLE "Address" ADD CONSTRAINT "Address_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "Shelter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);

    await db.query(`
      ALTER TABLE "Pet" ADD CONSTRAINT "Pet_shelter_id_fkey" FOREIGN KEY ("shelter_id") REFERENCES "Shelter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `);

    await db.query(`
      ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `);

    await db.query(`
      ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `);

    await db.query(`
      INSERT INTO public."User" ("createdAt", "updatedAt", name, email, about, url_photo, phone, password, role, active) 
      VALUES 
      ('2023-10-12 14:47:10.741', '2023-10-12 14:47:10.741', 'Lynnett Marzella', 'lmarzella0@spotify.com', 'in magna bibendum imperdiet nullam orci pede venenatis non sodales sed tincidunt eu', 'https://robohash.org/magniutanimi.png?size=50x50&set=set1', '767-758-1411', '4URisqt4E', 'TUTOR', true),
      ('2023-10-12 14:47:10.741', '2023-10-12 14:47:10.741', 'Ermentrude Atcherley', 'eatcherley1@vimeo.com', 'felis ut at dolor quis odio consequat varius integer ac leo pellentesque ultrices mattis odio donec vitae', 'https://robohash.org/reiciendissintea.png?size=50x50&set=set1', '333-393-4648', '3dt2dDfhNi7', 'TUTOR', true),
      ('2023-10-12 14:47:10.741', '2023-10-12 14:47:10.741', 'Bartholomew Muckle', 'bmuckle2@japanpost.jp', 'rutrum at lorem integer tincidunt ante vel ipsum praesent blandit lacinia erat vestibulum sed magna at nunc commodo', 'https://robohash.org/minimaaliquamnatus.png?size=50x50&set=set1', '886-200-9493', '2G3Qp9kaE2', 'TUTOR', true),
      ('2023-10-12 14:47:10.741', '2023-10-12 14:47:10.741', 'Joby Skyrme', 'jskyrme3@yellowpages.com', 'lacus morbi quis tortor id nulla ultrices aliquet maecenas leo odio', 'https://robohash.org/voluptatesautdeleniti.png?size=50x50&set=set1', '728-334-1016', 'baSDQfBNSEs', 'ADMIN', true),
      ('2023-10-12 14:47:10.741', '2023-10-12 14:47:10.741', 'Jessey Bernaciak', 'jbernaciak4@springer.com', 'posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat', 'https://robohash.org/possimusveniamdolorum.png?size=50x50&set=set1', '753-777-9776', 'l5hy08pu6ZBC', 'ADMIN', true),
      ('2023-10-12 14:47:10.741', '2023-10-12 14:47:10.741', 'Bear Lodford', 'blodford5@ed.gov', 'lacinia eget tincidunt eget tempus vel pede morbi porttitor lorem id ligula suspendisse ornare consequat', 'https://robohash.org/ipsamidoccaecati.png?size=50x50&set=set1', '513-318-1457', 'EzExMNsRsGx', 'TUTOR', true),
      ('2023-10-12 14:47:10.741', '2023-10-12 14:47:10.741', 'Hilary McClancy', 'hmcclancy6@tumblr.com', 'dapibus dolor vel est donec odio justo sollicitudin ut suscipit a feugiat et eros vestibulum ac', 'https://robohash.org/nonofficiisiusto.png?size=50x50&set=set1', '850-926-8128', '5oKKqIoQUFi', 'TUTOR', true),
      ('2023-10-12 14:47:10.741', '2023-10-12 14:47:10.741', 'Laurie Antonucci', 'lantonucci7@ocn.ne.jp', 'consequat nulla nisl nunc nisl duis bibendum felis sed interdum venenatis turpis enim blandit mi in', 'https://robohash.org/dolorempraesentiumpossimus.png?size=50x50&set=set1', '188-493-8802', '5brfFO', 'TUTOR', true),
      ('2023-10-12 14:47:10.741', '2023-10-12 14:47:10.741', 'Elaina Glading', 'eglading8@mapy.cz', 'posuere cubilia curae nulla dapibus dolor vel est donec', 'https://robohash.org/quoexcepturiearum.png?size=50x50&set=set1', '940-911-1079', 'cDtBgDeS2y', 'TUTOR', true),
      ('2023-10-12 14:47:10.741', '2023-10-12 14:47:10.741', 'Ali Gaunson', 'agaunson9@bluehost.com', 'volutpat in congue etiam justo etiam pretium iaculis justo in hac habitasse platea dictumst etiam faucibus cursus urna', 'https://robohash.org/repellendusminimaea.png?size=50x50&set=set1', '918-251-9844', 'Y18HnpmvqKlg', 'TUTOR', true);
    `);

    await db.query(`
      INSERT INTO public."Shelter" ("createdAt", "updatedAt", name, email, password, phone, about, active) 
      VALUES 
      ('2023-10-12 14:47:10.748', '2023-10-12 14:47:10.748', 'Pennie Jedrychowski', 'pjedrychowski0@prnewswire.com', 'gfxp2V', '372-277-1078', 'laoreet ut rhoncus aliquet pulvinar sed nisl nunc', true),
      ('2023-10-12 14:47:10.748', '2023-10-12 14:47:10.748', 'Ladonna Rosenstiel', 'lrosenstiel1@redcross.org', 'R8bD8nd', '591-298-3059', 'eget vulputate ut ultrices vel augue vestibulum ante ipsum primis', true),
      ('2023-10-12 14:47:10.748', '2023-10-12 14:47:10.748', 'Ike Barwise', 'ibarwise2@topsy.com', 'IAJJwdmDmiQj', '549-182-4285', 'vehicula condimentum curabitur in libero ut massa volutpat convallis', true),
      ('2023-10-12 14:47:10.748', '2023-10-12 14:47:10.748', 'Janeen Simoes', 'jsimoes3@merriam-webster.com', 'hO9iOV', '933-890-4814', 'tellus in sagittis dui vel nisl duis ac nibh fusce', true),
      ('2023-10-12 14:47:10.748', '2023-10-12 14:47:10.748', 'Delphinia Presdee', 'dpresdee4@noaa.gov', '2ir3bkotk', '291-372-3066', 'vel lectus in quam fringilla rhoncus', true),
      ('2023-10-12 14:47:10.748', '2023-10-12 14:47:10.748', 'Carmel Aiston', 'caiston5@github.com', 'yAe8WC2', '538-695-3704', 'massa volutpat convallis morbi odio odio elementum', true),
      ('2023-10-12 14:47:10.748', '2023-10-12 14:47:10.748', 'Cele Wilmut', 'cwilmut6@amazon.de', 'MZZOa3MGda16', '822-139-5582', 'ut erat curabitur gravida nisi at nibh in hac habitasse', true),
      ('2023-10-12 14:47:10.748', '2023-10-12 14:47:10.748', 'Nani Busher', 'nbusher7@amazon.de', 'm0xE8pqW', '539-185-7657', 'accumsan tortor quis turpis sed ante', true),
      ('2023-10-12 14:47:10.748', '2023-10-12 14:47:10.748', 'Pall Carayol', 'pcarayol8@over-blog.com', 'oKEzEnY', '141-651-0513', 'donec dapibus duis at velit eu est', true),
      ('2023-10-12 14:47:10.748', '2023-10-12 14:47:10.748', 'Fabiano Topley', 'ftopley9@auda.org.au', 'jhM8biqLax', '109-878-6124', 'maecenas tristique est et tempus semper est', true);
    `);

    await db.query(`
      INSERT INTO public."Pet" ("createdAt", "updatedAt", url_photo, age, description, available, name, shelter_id)
      VALUES 
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/1', '2019-05-10 00:00:00', 'Cute and cuddly, this puppy will steal your heart.', true, 'Buddy', 1),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/2', '2020-01-15 00:00:00', 'Affectionate and playful, this kitten is full of energy.', false, 'Mittens', 2),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/3', '2018-08-23 00:00:00', 'Loyal and friendly, this dog loves to be by your side.', true, 'Rocky', 3),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/4', '2021-02-19 00:00:00', 'Gentle and sweet, this cat will make a perfect lap cat.', false, 'Luna', 4),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/5', '2017-06-12 00:00:00', 'Adventurous and curious, this kitten is always exploring.', true, 'Whiskers', 5),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/6', '2016-04-05 00:00:00', 'Elegant and sophisticated, this cat will add grace to your home.', true, 'Midnight', 6),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/7', '2019-11-01 00:00:00', 'Lively and energetic, this pup will keep you on your toes.', false, 'Max', 7),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/8', '2015-02-14 00:00:00', 'Friendly and affectionate, this dog loves attention.', true, 'Daisy', 8),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/9', '2014-08-19 00:00:00', 'Intelligent and protective, this dog will guard your home.', true, 'Rufus', 9),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/10', '2022-03-05 00:00:00', 'Tiny and adorable, this kitten will melt your heart.', true, 'Peanut', 10),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/11', '2013-05-12 00:00:00', 'Active and playful, this dog loves to run and play.', false, 'Charlie', 4),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/12', '2012-09-29 00:00:00', 'Calm and relaxed, this cat is the perfect lap cat.', true, 'Fluffy', 7),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/13', '2019-12-10 00:00:00', 'Smart and friendly, this dog is eager to please.', true, 'Bailey', 8),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/14', '2020-06-20 00:00:00', 'Graceful and elegant, this cat is a true beauty.', true, 'Sophie', 2),
      ('2023-10-12 14:47:10.759', '2023-10-12 14:47:10.759', 'https://example.com/photos/15', '2018-02-15 00:00:00', 'Laid back and mellow, this dog is perfect for a quiet home.', true, 'Oliver', 1);    
    `);

    await db.query(`
      INSERT INTO public."Adoption" ("createdAt", "updatedAt", date, user_id, pet_id)
      VALUES 
      ('2023-10-12 14:47:10.763', '2023-10-12 14:47:10.763', '2023-05-09 00:00:00', 1, 2),
      ('2023-10-12 14:47:10.763', '2023-10-12 14:47:10.763', '2023-05-10 00:00:00', 2, 4),
      ('2023-10-12 14:47:10.763', '2023-10-12 14:47:10.763', '2023-05-11 00:00:00', 3, 7),
      ('2023-10-12 14:47:10.763', '2023-10-12 14:47:10.763', '2023-05-12 00:00:00', 1, 11),
      ('2023-10-12 14:47:10.763', '2023-10-12 14:47:10.763', '2023-05-13 00:00:00', 2, 14);
    `);

    await db.query(`
      INSERT INTO public."Address" ("createdAt", "updatedAt", number, postcode, address, city, country, user_id, shelter_id)
      VALUES 
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '29', 'BN20 8JS', '18th Floor', 'Rogóźno', 'Poland', 1, NULL),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '23', 'DL14 0PR', 'Apt 362', 'Sobreda', 'Portugal', 2, NULL),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '7', 'BA11 2AP', 'Apt 1807', 'Huangling', 'China', 3, NULL),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '8', 'BS34 8QF', 'Room 592', 'Timba Timuk', 'Indonesia', 4, NULL),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '326', 'HD4 5BG', 'Room 639', 'Masarayao', 'Philippines', 5, NULL),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '1', 'GU18 5TL', 'Suite 30', 'Kohtla-Järve', 'Estonia', 6, NULL),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '8132', 'RH17 6JT', 'PO Box 53229', 'Rashaant', 'Mongolia', 7, NULL),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '580', 'WN2 4SU', '14th Floor', 'Aragarças', 'Brazil', 8, NULL),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '84456', 'DH7 6FD', 'PO Box 74582', 'Nantes', 'France', 9, NULL),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '48', 'WA7 2YE', 'Room 232', 'Guérande', 'France', 10, NULL),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '57287', 'SL6 5AH', 'PO Box 35777', 'Melekyne', 'Ukraine', NULL, 1),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '13', 'BA21 4EX', '13th Floor', 'Haquira', 'Peru', NULL, 2),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '199', 'CB4 1JE', 'Room 463', 'Dikson', 'Russia', NULL, 3),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '10231', 'NG3 1NJ', 'Room 1580', 'Stari Banovci', 'Serbia', NULL, 4),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '6342', 'PA1 1YP', 'Apt 1982', 'Pskov', 'Russia', NULL, 5),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '0', 'GL7 6NL', '19th Floor', 'Wangshi', 'China', NULL, 6),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '7408', 'PR4 4BS', 'Apt 26', 'Pul-e Sangī', 'Afghanistan', NULL, 7),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '4', 'LL13 0GA', 'PO Box 5323', 'Al Maḩwīt', 'Yemen', NULL, 8),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '0789', 'DH6 3AP', 'Room 1928', 'Nunutba', 'Indonesia', NULL, 9),
      ('2023-10-12 14:47:10.752', '2023-10-12 14:47:10.752', '80364', 'ST7 4BU', 'PO Box 80188', 'Lebao', 'Indonesia', NULL, 10);
    `);
  } catch (err) {
    console.error('Error creating tables:', err);
    throw err;
  }
}

export default seed;