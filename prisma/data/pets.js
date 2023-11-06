const petData = [
  {
    url_photo:
      'https://media.4-paws.org/1/e/d/6/1ed6da75afe37d82757142dc7c6633a532f53a7d/VIER%20PFOTEN_2019-03-15_001-2886x1999-1920x1330.jpg',
    age: new Date('2019-05-10'),
    description: 'Cute and cuddly, this puppy will steal your heart.',
    available: true,
    name: 'Buddy',
    shelter_id: 1,
  },
  {
    url_photo:
      'https://upload.wikimedia.org/wikipedia/commons/8/8f/Cute-kittens-12929201-1600-1200.jpg',
    age: new Date('2020-01-15'),
    description: 'Affectionate and playful, this kitten is full of energy.',
    available: false,
    name: 'Mittens',
    shelter_id: 2,
  },
  {
    url_photo:
      'https://www.vet.cornell.edu/sites/default/files/dog%20image%201-unsplash.JPG',
    age: new Date('2018-08-23'),
    description: 'Loyal and friendly, this dog loves to be by your side.',
    available: true,
    name: 'Rocky',
    shelter_id: 3,
  },
  {
    url_photo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/767px-Cat_November_2010-1a.jpg',
    age: new Date('2021-02-19'),
    description: 'Gentle and sweet, this cat will make a perfect lap cat.',
    available: false,
    name: 'Luna',
    shelter_id: 4,
  },
  {
    url_photo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Photo_of_a_kitten.jpg/800px-Photo_of_a_kitten.jpg',
    age: new Date('2017-06-12'),
    description: 'Adventurous and curious, this kitten is always exploring.',
    available: true,
    name: 'Whiskers',
    shelter_id: 5,
  },
  {
    url_photo:
      'https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg',
    age: new Date('2016-04-05'),
    description:
      'Elegant and sophisticated, this cat will add grace to your home.',
    available: true,
    name: 'Midnight',
    shelter_id: 6,
  },
  {
    url_photo:
      'https://www.thefarmersdog.com/digest/wp-content/uploads/2021/05/Pug-potty-2-1400x807.jpg',
    age: new Date('2019-11-01'),
    description: 'Lively and energetic, this pup will keep you on your toes.',
    available: false,
    name: 'Max',
    shelter_id: 7,
  },
  {
    url_photo:
      'https://cdn.britannica.com/16/234216-050-C66F8665/beagle-hound-dog.jpg',
    age: new Date('2015-02-14'),
    description: 'Friendly and affectionate, this dog loves attention.',
    available: true,
    name: 'Daisy',
    shelter_id: 8,
  },
  {
    url_photo:
      'https://static.vecteezy.com/system/resources/previews/005/857/332/non_2x/funny-portrait-of-cute-corgi-dog-outdoors-free-photo.jpg',
    age: new Date('2014-08-19'),
    description: 'Intelligent and protective, this dog will guard your home.',
    available: true,
    name: 'Rufus',
    shelter_id: 9,
  },
  {
    url_photo:
      'https://upload.wikimedia.org/wikipedia/commons/a/a5/Red_Kitten_01.jpg',
    age: new Date('2022-03-05'),
    description: 'Tiny and adorable, this kitten will melt your heart.',
    available: true,
    name: 'Peanut',
    shelter_id: 9,
  },
  {
    url_photo:
      'https://www.thesprucepets.com/thmb/hxWjs7evF2hP1Fb1c1HAvRi_Rw0=/2765x0/filters:no_upscale():strip_icc()/chinese-dog-breeds-4797219-hero-2a1e9c5ed2c54d00aef75b05c5db399c.jpg',
    age: new Date('2013-05-12'),
    description: 'Active and playful, this dog loves to run and play.',
    available: false,
    name: 'Charlie',
    shelter_id: 4,
  },
  {
    url_photo:
      'https://developer.ridgerun.com/wiki/images/8/80/Egyptian_cat.jpg',
    age: new Date('2012-09-29'),
    description: 'Calm and relaxed, this cat is the perfect lap cat.',
    available: true,
    name: 'Fluffy',
    shelter_id: 7,
  },
  {
    url_photo:
      'https://cdn.britannica.com/46/233846-050-8D30A43B/Boxer-dog.jpg',
    age: new Date('2019-12-10'),
    description: 'Smart and friendly, this dog is eager to please.',
    available: true,
    name: 'Bailey',
    shelter_id: 8,
  },
  {
    url_photo:
      'https://static.vecteezy.com/system/resources/previews/002/098/203/non_2x/silver-tabby-cat-sitting-on-green-background-free-photo.jpg',
    age: new Date('2020-06-20'),
    description: 'Graceful and elegant, this cat is a true beauty.',
    available: true,
    name: 'Sophie',
    shelter_id: 2,
  },
  {
    url_photo:
      'https://upload.wikimedia.org/wikipedia/commons/6/64/White_Pomeranian.jpg',
    age: new Date('2018-02-15'),
    description: 'Laid back and mellow, this dog is perfect for a quiet home.',
    available: true,
    name: 'Oliver',
    shelter_id: 1,
  },
];

export default petData;
