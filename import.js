var vertx = require('vertx')

var eb = vertx.eventBus;

var pa = 'test.mongodb';

var anmalningar = [
	{
    titel: 'Försvunnen borrhammare',
		anmalningsstatus: 'SKAPAD',
		ovrigastatusar: '',
		ovrigt: 'övrigt',
		anmalare: {
			firstname: 'Johan',
			lastname: 'Johansson',
			email: 'jj@ncc.se',
			username: 'admin'
		},
		malsagare: {
			organisation: {
				_id: 1,
				namn: 'NCC Construction Sverige AB',
				adress: 'Klubbhusgatan 15',
				postnr: '553 03 Jönköping',
				orgnr: '123456789',
				epost: 'info@ncc.se'
			},
			forsakringsbolag: 'Folksam',
			forsakringsnummer: '120222'
		},
		stulnaObjekt: [
			{
				namn: 'Makita borrhammare',
				beskrivning: 'blå å fin',
				typ: 'HKJ2',
				stoldmarkning: 'Ja',
				maskinId: '3287642'
			},
			{
				namn: 'Makita Universaldammsugare',
				beskrivning: 'Två hjul trasiga...',
				typ: '446LX',
				stoldmarkning: 'Nej',
				maskinId: ''
			}
		],
		tidOchPlats: {
			tid: '',
			tidSenastLamnad: '',
			adress: 'Västra Långgatan 22',
			postnr: '55318'
		},
		forlopp: 'Förlopp här',
		loggbok: [
			{
				rubrik: 'Hej',
				meddelande: 'test-meddelande',
				tid: '123456789',
				person: {
					firstname: 'Johan',
					lastname: 'Johannesson',
					email: 'jj@ncc.se',
					username: 'jojo'
				}
			}
		],
		handelser: [
			{
				typ: 'skapad',
				tid: '1404660106190',
				person: {
					firstname: 'Johan',
					lastname: 'Johansson',
					email: 'jj@ncc.se',
					username: 'admin'
				}
			},
			{
				typ: 'logg',
				tid: '1404660126190',
				person: {
					firstname: 'Johan',
					lastname: 'Johannesson',
					email: 'jj@ncc.se',
					username: 'jojo'
				}
			}
		]
	},
	{
    titel: 'Inbrott i redskapsbod, helgen v 38',
		anmalningsstatus: 'SKAPAD',
		ovrigastatusar: '',
		ovrigt: null,
		anmalare: {
			firstname: 'Johan',
			lastname: 'Jotunheimsson',
			email: 'jj@skanska.se',
			username: 'skanska-johan'
		},
		malsagare: {
			organisation: {
				_id: 2,
				namn: 'Byggkompaniet AB',
				adress: 'Granitvägen 1',
				postnr: '553 03	 Jönköping',
				orgnr: '123456789',
				epost: 'info@byggkompaniet.se',
			},
			forsakringsbolag: 'Folksam',
			forsakringsnummer: '120222-2'
		},
		stulnaObjekt: [
			{
				namn: 'Milwaukee Kabelklippare M12CC',
				beskrivning: 'Röd, tejpad med silvertejp kring handtaget...',
				typ: 'M12CC',
				stoldmarkning: 'Ja',
				maskinId: '234A789F'
			},
			{
				namn: 'Makita gersåg',
				beskrivning: 'Batteridriven kap- och geringssåg på 18V i nyskick (inklusive laddare och tre extrabatteri)',
				typ: 'BLS713Z 18 volt',
				stoldmarkning: 'Nej',
				maskinId: ''
			},
			{
				namn: 'Bosch GML byggplatsradio',
				beskrivning: 'Nyskick',
				typ: 'GML 20',
				stoldmarkning: 'Nej',
				maskinId: ''
			},
			{
				namn: 'Festtool dammsugare',
				beskrivning: 'Trasig sladdvinda, något repig - annars i bra skick',
				typ: 'CTL midi',
				stoldmarkning: 'Ja',
				maskinId: '3408-3422-2342-2343'
			},
			{
				namn: 'Festtool skruvautomat',
				beskrivning: 'Skruvautomat inkl. bits och 3-4 paket skruv',
				typ: null,
				stoldmarkning: 'Nej',
				maskinId: null
			}
		],
		tidOchPlats: {
			tid: 'helgen v 38',
			tidSenastLamnad: 'fredag v38',
			adress: 'Lasarettsgatan 2B',
			postnr: '55318'
		},
		forlopp: 'Redskapsbod hittades måndag morgon v39 uppbruten.',
		loggbok: [],
		handelser: [
			{
				typ: 'skapad',
				tid: '1404510106190',
				person: {
					firstname: 'Johan',
					lastname: 'Jotunheimsson',
					email: 'jj@skanska.se',
					username: 'skanska-johan'
				}
			},
			{
				typ: 'uppdaterad',
				tid: '1404590106190',
				person: {
					firstname: 'Johan',
					lastname: 'Jotunheimsson',
					email: 'jj@skanska.se',
					username: 'skanska-johan'
				}
			}
		]
	}
];

var users = [
	{
		firstname: 'Johan',
		lastname: 'Johansson',
		email: 'jj@ncc.se',
		username: 'admin',
		password: 'password',
		organisationId: 1,
		roller: ['registrerad']
	},
	{
		firstname: 'Johan',
		lastname: 'Johannesson',
		email: 'jj@byggkompaniet.se',
		username: 'jojo',
		password: 'password',
		organisationId: 2,
		roller: ['registrerad']
	},
	{
		firstname: 'Johan',
		lastname: 'Johanzon',
		email: 'jj@peab.se',
		username: 'johjoh',
		password: 'password',
		organisationId: 3,
		roller: ['registrerad']
	},
	{
		firstname: 'Johan',
		lastname: 'Jotunheimsson',
		email: 'jj@skanska.se',
		username: 'skanska-johan',
		password: 'password',
		organisationId: 4,
		roller: ['registrerad']
	}
];

var organisations = [
	{
		_id: 1,
		namn: 'NCC Construction Sverige AB',
		adress: 'Klubbhusgatan 15',
		postnr: '553 03 Jönköping',
		orgnr: '123456789',
		epost: 'info@ncc.se',
	},
	{
		_id: 2,
		namn: 'Byggkompaniet AB',
		adress: 'Granitvägen 1',
		postnr: '553 03	 Jönköping',
		orgnr: '123456789',
		epost: 'info@byggkompaniet.se',
	},
	{
		_id: 3,
		namn: 'PEAB Sverige AB',
		adress: 'Anders Personsgatan 2',
		postnr: '416 64	 Göteborg',
		orgnr: '123456789',
		epost: 'info@peab.se',
	},
	{
		_id: 4,
		namn: 'Skanska Sverige AB',
		adress: 'Warfvinges väg 25',
		postnr: '112 74 Stockholm',
		orgnr: '123456789',
		epost: 'info@skanska.se'
	}
];

// First delete everything

eb.send(pa, {action: 'delete', collection: 'anmalningar', matcher: {}}, function(reply) {
	eb.send(pa, {action: 'delete', collection: 'users', matcher: {}}, function(reply) {
		eb.send(pa, {action: 'delete', collection: 'organisations', matcher: {}}, function(reply) {
			// Insert albums - in real life price would probably be stored in a different collection, but, hey, this is a demo.
			for (var i = 0; i < anmalningar.length; i++) {
				eb.send(pa, {
					action: 'save',
					collection: 'anmalningar',
					document: anmalningar[i]
				});
			}
			
			for (var i = 0; i < organisations.length; i++) {
				eb.send(pa, {
					action: 'save',
					collection: 'organisations',
					document: organisations[i]
				});
			}
			
			for (var i = 0; i < users.length; i++) {
				eb.send(pa, {
					action: 'save',
					collection: 'users',
					document: users[i]
				});
			}
		});
	});
});


