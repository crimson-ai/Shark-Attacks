// Counter for average annual number of shark bites
const sharkBitesCounter = new countUp.CountUp('shark-bites-counter', 102,
    { enableScrollSpy: true,
        duration: 10,
        delay: 3,
        useEasing: true,
        scrollSpyDelay: 3000,
        prefix: 'In 2021, there were <br>',
        suffix: ' bites globally.',
        scrollSpyOnce: false
    }
)
//sharkBitesCounter


// Counter for average annual number of human fatalities
const humanFatalitiesCounter = new countUp.CountUp('human-fatalities-counter', 12,
                                                        { enableScrollSpy: true,
                                                          duration: 10,
                                                          delay: 5,
                                                          useEasing: true,
                                                          scrollSpyDelay: 4000,
                                                          prefix: 'In 2021, there were <br>',
                                                          suffix: ' human fatalities.',
                                                          scrollSpyOnce: false
                                                        }
                                                   )
humanFatalitiesCounter


// Counter for average annual number of shark fatalities
const sharkFatalitiesCounter = new countUp.CountUp('shark-fatalities-counter-annually', 100,
                                                        { enableScrollSpy: true,
                                                          duration: 10,
                                                          delay: 3,
                                                          useEasing: true,
                                                          scrollSpyDelay: 5000,
                                                          prefix: 'Humans kill <br>',
                                                          suffix: ' million sharks annually.',
                                                          scrollSpyOnce: true
                                                        }
                                                   )
sharkFatalitiesCounter


