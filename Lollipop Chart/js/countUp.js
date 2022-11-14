
// Counter for average annual number of human fatalities
const humanFatalitiesCounter = new countUp.CountUp('human-fatalities-counter', 12,
    { enableScrollSpy: true,
        duration: 5,
        useEasing: true,
        scrollSpyDelay: 3,
        prefix: 'Amazingly, there are fewer than  ',
        suffix: ' human fatalities resulting from a shark bite.',
//                                                          scrollSpyOnce: true
    }
)
humanFatalitiesCounter


// Counter for average annual number of shark fatalities
const sharkFatalitiesCounter = new countUp.CountUp('shark-fatalities-counter', 100,
    { enableScrollSpy: true,
        duration: 15,
        useEasing: true,
        scrollSpyDelay: 3,
        prefix: 'Each year, humans kill approximately ',
        suffix: ' <strong><i>million</i></strong> sharks.',
        scrollSpyOnce: true
    }
)
sharkFatalitiesCounter


// Counter for average annual number of shark bites
const sharkBitesCounter = new countUp.CountUp('shark-bites-counter', 70,
    { enableScrollSpy: true,
        duration: 15,
        useEasing: true,
        scrollSpyDelay: 3,
        prefix: 'Each year, sharks bite approximately ',
        suffix: ' humans <i>globally</i>.',
        scrollSpyOnce: true
    }
)
sharkBitesCounter