var vertx = require('vertx')

var eb = vertx.eventBus;

var pa = 'test.mongodb';

var anmalningar = [
  {
    _id: '1',
    reporter: 'Léon Bourgeois',
    gadget: 'Black & decker planslip DUOSAND',
    subject: 'Stulen planslip',
    description: 'Verktyg försvunnet under natten till 1/3',
    currentPriceSEK: 450
  },
  {
    _id: '2',
    reporter: 'Aung San Suu Kyi',
    gadget: 'Motorsåg Husqvarna 536 Li XP',
    subject: 'Motorsåg plockad ur vertygsskjul',
    description: 'Försvunnet under helgen vecka 48',
    currentPriceSEK: 7500
  },
  {
    _id: '3',
    reporter: 'Martti Ahtisaari',
    gadget: 'Motorkap Husqvarna K760',
    subject: 'Besindriven motorkap försvunnen',
    description: 'Well, the way they make shows is, they make one show. That shows called a pilot...',
    currentPriceSEK: 6000
  },
  {
    _id: '4',
    reporter: 'Liu Xiaobo',
    gadget: 'Husqvarna 440 såg, 2,1 kW',
    subject: 'Motorsåg försvunnen...',
    description: 'You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out.',
    currentPriceSEK: 5500
  },
  {
    _id: '5',
    reporter: 'Wangari Maathai',
    gadget: 'Husqvarna RT422 Rider',
    subject: 'Gräsklippare på rymmen!',
    description: 'The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brothers keeper and the finder of lost children.',
    currentPriceSEK: 89000
  },
  {
    _id: '6',
    reporter: 'Nelson M',
    gadget: 'Festool betongslip',
    subject: 'Borta eller bortslarvad',
    description: '...and I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee.',
    currentPriceSEK: 4000
  },
  {
    _id: '7',
    reporter: 'Desmond Tutu ',
    gadget: 'Peltor hörselkåpor',
    subject: 'Hörselkåpor försvunna på Smirres',
    description: 'And I will strike down upon thee with great vengeance and furious anger...',
    currentPriceSEK: 1500
  },
  {
    _id: '8',
    reporter: 'Ellen Johnson-Sirleaf',
    gadget: 'Makita borrhammare',
    subject: 'En borrhammare av okänd modell stulen',
    description: 'And I will strike down upon thee with great vengeance and furious anger...',
    currentPriceSEK: 4850
  }
];

// First delete everything

eb.send(pa, {action: 'delete', collection: 'anmalningar', matcher: {}}, function(reply) {
  eb.send(pa, {action: 'delete', collection: 'users', matcher: {}}, function(reply) {
    // Insert albums - in real life price would probably be stored in a different collection, but, hey, this is a demo.

    for (var i = 0; i < anmalningar.length; i++) {
      eb.send(pa, {
        action: 'save',
        collection: 'anmalningar',
        document: anmalningar[i]
      });
    }

    // And a user

    eb.send(pa, {
      action: 'save',
      collection: 'users',
      document: {
        firstname: 'Johan',
        lastname: 'Johansson',
        email: 'jj@localhost.com',
        username: 'admin',
        password: 'password'
      }
    });

    eb.send(pa, {
      action: 'save',
      collection: 'users',
      document: {
        firstname: 'Björn',
        lastname: 'Svanmo',
        email: 'swanmo@localhost.com',
        username: 'swanmo',
        password: 'password'
      }
    });

    eb.send(pa, {
      action: 'save',
      collection: 'users',
      document: {
        firstname: 'Johan',
        lastname: 'Hanson',
        email: 'johan.hanson@consid.se',
        username: 'jhanso',
        password: 'password'
      }
    });

  });
});


