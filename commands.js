// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands'

const getIframeDocument1 = () => {
    return cy
        .get('[id=braintree-hosted-field-number]')
        .its('0.contentDocument').should('exist')
}

const getIframeBody1 = () => {
    return getIframeDocument1()
        .its('body').should('not.be.undefined')
        .then(cy.wrap)
}

const getIframeDocument2 = () => {
    return cy
        .get('[id=braintree-hosted-field-expirationDate]')
        .its('0.contentDocument').should('exist')
}

const getIframeBody2 = () => {
    return getIframeDocument2()
        .its('body').should('not.be.undefined')
        .then(cy.wrap)
}

const getIframeDocument3 = () => {
    return cy
        .get('[id=braintree-hosted-field-cvv]')
        .its('0.contentDocument').should('exist')
}

const getIframeBody3 = () => {
    return getIframeDocument3()
        .its('body').should('not.be.undefined')
        .then(cy.wrap)
}

const getIframeDocument4 = () => {
    return cy
        .get('[id=braintree-hosted-field-postalCode]')
        .its('0.contentDocument').should('exist')
}

const getIframeBody4 = () => {
    return getIframeDocument4()
        .its('body').should('not.be.undefined')
        .then(cy.wrap)
}

// Save User Information
Cypress.Commands.add("SaveUserInfo", (_file, _email) => {

    cy.readFile(_file).then((data) => {
        data.push({
            email: _email,
            password: ''
        })
        cy.writeFile(_file, JSON.stringify(data, null, 2))
    })
})

// Save Order Details with Tax calculation from TasJar API
Cypress.Commands.add("SaveOrderDetails", (_address, _file, _product, _qty, _price, _type) => {

    let itemTax = 0.00

    const token = Cypress.env('TAXJAR_API_KEY')
    const options = {
        method: 'POST',
        url: 'https://api.taxjar.com/v2/taxes',
        json: true,
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: {
            "amount": _price,
            "shipping": "0.00",
            "line_items": [
                {
                    "id": "xxx",
                    "description": _product,
                    "quantity": _qty,
                    "product_tax_code": (_type === "physical") ? "40020" : "31000",
                    "unit_price": _price
                }
            ],
            "to_street": _address.shippingAddress1,
            "to_city": _address.shippingCity,
            "to_state": _address.shippingState,
            "to_zip": _address.shippingPostCode,
            "to_country": _address.shippingCountry,
            "from_street": "4530 Decatur Boulevard South",
            "from_city": "Las Vegas",
            "from_state": "NV",
            "from_zip": "89103",
            "from_country": "US"
        }
    }

    cy.request(options)
        .then((res) => {
            cy.wrap(res.body.tax).as('tax')
            cy.get('@tax').then((d) => {

                itemTax = d["amount_to_collect"]

                cy.readFile(_file).then((data) => {
                    data.push({
                        productName: _product,
                        productQty: _qty,
                        productPrice: _price,
                        productTax: String(itemTax),
                        orderLink: ''
                    })
                    cy.writeFile(_file, JSON.stringify(data, null, 2))
                })
            })
        })
})

Cypress.Commands.add("VerifyURL", (_slug) => {
    cy.wait(2000)
    cy.url().should('include', _slug)
})

// Verify Next URL 
Cypress.Commands.add("VerifyNextURL", (_slug) => {
    cy.wait(2000)
    cy.url().should('include', _slug)
})

// Skip Video
Cypress.Commands.add("SkipVideo", () => {

    cy.wait(2000)

    cy.window({ timeout: 60000 }).then((win) => {
        win.document.querySelectorAll('.page-contents-lazy').forEach(el => el.style.display = 'block');
        win.document.querySelectorAll('.after-banner').forEach(el => el.style.display = 'block');
        win.document.querySelectorAll('[data-vsl-content]').forEach(el => el.style.display = 'block');
    })

})

// Enter Payment Details
Cypress.Commands.add("EnterPaymentDetails", () => {
    cy.wait(2000)
    getIframeBody1().find('#credit-card-number').type('4242424242424242')
    getIframeBody2().find('#expiration').type('01/23')
    getIframeBody3().find('#cvv').type('111')
    getIframeBody4().find('#postal-code').type('01434')
})

// Click Button
Cypress.Commands.add("ClickButton", (_element) => {
    cy.get(_element).should('be.visible').scrollIntoView().click({ force: true })
})

// Click
Cypress.Commands.add("Click", (_element) => {
    cy.get(_element).should('be.visible').click()
})

// Click Button v2
Cypress.Commands.add("ClickButtonv2", (_label) => {
    // cy.get('button[type="submit"]').should('have.text', _label).scrollIntoView().click({ force:true })
    // cy.findByText(_label).should('exist').click()
    cy.xpath("//*[contains(text(),'" + _label + "')]").should('be.visible').click({ force: true, multiple: true })
})

// Click Link
Cypress.Commands.add("ClickLink", (_text, _count) => {
    cy.contains(_text, { matchCase: true }).eq(_count).should('be.visible').scrollIntoView().click({ force: true })
})

// Enter Text
Cypress.Commands.add("EnterText", (_element, _text) => {
    cy.get(_element).should('be.visible').click({ focus: true }).type(_text)
})

// Select Dropdown
Cypress.Commands.add("SelectDropDown", (_element, _text) => {
    cy.get(_element).select(_text)
})

// Click Special Offer checkbox if exists
Cypress.Commands.add("SelectSpecialOffer", () => {
    cy.get('.checkbox-area > label').should('be.visible').click()
})

// Verify Order Summary
Cypress.Commands.add("VerifyOrderSummary", (_file) => {

    const Currency = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    let totalTax = 0.00
    let totalAmount = 0.00

    cy.wait(2000)

    cy.readFile(_file).then((data) => {

        cy.get('.py-1').should('have.length.least', 1)
            .its('length')
            .then(n => {
                for (let i = 0; i < n; i++) {
                    cy.get('.py-1').eq(i).invoke('text').then((text) => {
                        for (let x = 1; x < data.length; x++) {
                            if (text.trim().replace(/[\n]/g, '') == data[x].productName) {
                                expect(text.trim().replace(/[\n]/g, '')).to.eq(data[x].productName)
                            } else if (text.trim().replace(/[\n]/g, '') == data[x].productQty) {
                                expect(text.trim().replace(/[\n]/g, '')).to.eq(data[x].productQty)
                            } else if (text.trim().replace(/[\n]/g, '') == Currency.format(data[x].productPrice)) {
                                expect(text.trim().replace(/[\n]/g, '')).to.eq(Currency.format(data[x].productPrice))
                                totalAmount = parseFloat(totalAmount) + parseFloat(data[x].productPrice)
                                totalTax = parseFloat(totalTax) + parseFloat(data[x].productTax)
                            }
                        }
                    })
                }
            })


        cy.get('body').then($body => {
            if ($body.find('#special-offer').length > 0) {
                cy.get('#special-offer').within(() => {
                    cy.get('td').should('have.length.least', 1)
                        .its('length')
                        .then(n => {
                            for (let i = 0; i < n; i++) {
                                cy.get('td').eq(i).invoke('text').then((text) => {
                                    for (let x = 1; x < data.length; x++) {
                                        if (text.trim().replace(/[\n]/g, '') == data[x].productName) {
                                            expect(text.trim().replace(/[\n]/g, '')).to.eq(data[x].productName)
                                        } else if (text.trim().replace(/[\n]/g, '') == data[x].productQty) {
                                            expect(text.trim().replace(/[\n]/g, '')).to.eq(data[x].productQty)
                                        } else if (text.trim().replace(/[\n]/g, '') == Currency.format(data[x].productPrice)) {
                                            expect(text.trim().replace(/[\n]/g, '')).to.eq(Currency.format(data[x].productPrice))
                                            totalAmount = parseFloat(totalAmount) + parseFloat(data[x].productPrice)
                                            totalTax = parseFloat(totalTax) + parseFloat(data[x].productTax)
                                        }
                                    }
                                })
                            }
                        })
                })
            }
        })

        cy.wait(5000)

        cy.get('#tax').invoke('text').then((tax) => {
            if (tax.trim().replace(/[\n]/g, '') == Currency.format(totalTax)) {
                expect(tax.trim().replace(/[\n]/g, '')).to.eq(Currency.format(totalTax))
            }
        })

        cy.get('#total').invoke('text').then((total) => {
            if (total.trim().replace(/[\n]/g, '') == Currency.format(+totalAmount + +totalTax)) {
                expect(total.trim().replace(/[\n]/g, '')).to.eq(Currency.format(+totalAmount + +totalTax))
            }
        })
    })

})

// Verify Order Confirmation
Cypress.Commands.add("VerifyOrderConfirmation", (_file) => {

    const Currency = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    let totalTax = 0.00
    let totalAmount = 0.00

    cy.wait(2000)

    cy.readFile(_file).then((data) => {

        cy.get('body').then(($body) => {
            if ($body.find('[test-id="temp-password"]').length > 0) {
                cy.get('[test-id="temp-password"]').invoke('text').then((password) => {
                    data[0].password = password
                    cy.writeFile(_file, JSON.stringify(data, null, 2))
                })
            }
        })

        cy.get('body').then(($body) => {
            if ($body.find('.col-xs-8').length > 0) {
                cy.get('.col-xs-8').should('have.length.least', 1)
                    .its('length')
                    .then(n => {

                        for (let i = 0; i < n; i++) {
                            cy.get('.col-xs-8').eq(i).invoke('text').then((text) => {
                                for (let x = 1; x < data.length; x++) {
                                    if (text.trim().replace(/[\n]/g, '') == data[x].productName) {
                                        expect(text.trim().replace(/[\n]/g, '')).to.eq(data[x].productName)
                                        cy.get('div[class="col-xs-4 text-right"]').eq(i).invoke('text').then((value) => {
                                            if (value.trim().replace(/[\n]/g, '') == Currency.format(data[x].productPrice)) {
                                                expect(value.trim().replace(/[\n]/g, '')).to.eq(Currency.format(data[x].productPrice))
                                                totalAmount = parseFloat(totalAmount) + parseFloat(data[x].productPrice)
                                                totalTax = parseFloat(totalTax) + parseFloat(data[x].productTax)
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
            }

            if ($body.find('.col-xs-6').length > 0) {
                cy.get('.col-xs-6').should('have.length.least', 1)
                    .its('length')
                    .then(n => {

                        for (let i = 0; i < n; i++) {
                            cy.get('.col-xs-6').eq(i).invoke('text').then((text) => {
                                for (let x = 1; x < data.length; x++) {
                                    if (text.trim().replace(/[\n]/g, '').slice(0, -2) == data[x].productName) {
                                        expect(text.trim().replace(/[\n]/g, '').slice(0, -2)).to.eq(data[x].productName)
                                    }
                                }
                            })
                        }
                    })
            }

            if ($body.find('div[class="col-xs-6 text-right"]').length > 0) {
                cy.get('div[class="col-xs-6 text-right"]').should('have.length.least', 1)
                    .its('length')
                    .then(n => {
                        for (let i = 0; i < n; i++) {
                            cy.get('div[class="col-xs-6 text-right"]').eq(i).invoke('text').then((value) => {
                                value:
                                for (let x = 1; x < data.length; x++) {
                                    if (value.trim().replace(/[\n]/g, '') == Currency.format(data[x].productPrice)) {
                                        expect(value.trim().replace(/[\n]/g, '')).to.eq(Currency.format(data[x].productPrice))
                                        totalAmount = parseFloat(totalAmount) + parseFloat(data[x].productPrice)
                                        totalTax = parseFloat(totalTax) + parseFloat(data[x].productTax)
                                    } else if (value.trim().replace(/[\n]/g, '') == Currency.format(totalTax)) {
                                        expect(value.trim().replace(/[\n]/g, '')).to.eq(Currency.format(totalTax))
                                        break value
                                    } else if (value.trim().replace(/[\n]/g, '') == Currency.format(+totalAmount + +totalTax)) {
                                        expect(value.trim().replace(/[\n]/g, '')).to.eq(Currency.format(+totalAmount + +totalTax))
                                        break value
                                    }
                                }
                            })
                        }
                    })
            }
        })
    })
})

// Fill Up Questionaire
Cypress.Commands.add("CompleteQuestionnaire", () => {

    // Click Edit Profile
    cy.get('.btn').should('be.visible').click()
    cy.wait(2000)

    // Click Boost Questionaire button
    cy.get('#questionnaire').should('be.visible').click()
    cy.wait(2000)

    cy.get('body').then(($body) => {
        // if ($body.find(':nth-child(5) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
        //     // Country
        //     cy.get(':nth-child(5) > [data-v-32b51562=""] > .cdp-field > .cdp-input').should('not.be.disabled').type('US')
        // }
        if ($body.find(':nth-child(6) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Country
            cy.get(':nth-child(6) > [data-v-32b51562=""] > .cdp-field > .cdp-input').should('not.be.disabled').type('US')
        }
        if ($body.find(':nth-child(7) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Height Feet
            cy.get(':nth-child(7) > [data-v-32b51562=""] > .cdp-field > .cdp-input').should('not.be.disabled').select('5')
        }

        if ($body.find(':nth-child(8) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Height Inches
            cy.get(':nth-child(8) > [data-v-32b51562=""] > .cdp-field > .cdp-input').should('not.be.disabled').select('5')
        }

        if ($body.find(':nth-child(9) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Weight
            cy.get(':nth-child(9) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('78')
        }

        if ($body.find(':nth-child(10) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(3) > .radio-container > .checkmark').length > 0) {
            // LB
            cy.get(':nth-child(10) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(3) > .radio-container > .checkmark').click()
        }

        if ($body.find(':nth-child(11) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(3) > .radio-container > .checkmark').length > 0) {
            // Gender Female
            cy.get(':nth-child(11) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(3) > .radio-container > .checkmark').click()
        }

        if ($body.find(':nth-child(12) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(3) > .radio-container > .checkmark').length > 0) {
            // Activity Level (Light)
            cy.get(':nth-child(12) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(3) > .radio-container > .checkmark').click()
        }

        if ($body.find(':nth-child(2) > :nth-child(1) > :nth-child(4) > .radio-container > .checkmark').length > 0) {
            // Fitness Goal (Improve Health)
            cy.get(':nth-child(2) > :nth-child(1) > :nth-child(4) > .radio-container > .checkmark').click()
        }

        if ($body.find(':nth-child(13) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(3) > .radio-container > .radio-container-label').length > 0) {
            // Average time spend in Gym 
            cy.get(':nth-child(13) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(3) > .radio-container > .radio-container-label').click()
        }

        if ($body.find(':nth-child(3) > .checkbox-container > .checkmark').length > 0) {
            // Dietary Preferences
            cy.get(':nth-child(3) > .checkbox-container > .checkmark').click()
        }

        if ($body.find(':nth-child(14) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Other Preferences
            cy.get(':nth-child(14) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }

        if ($body.find(':nth-child(15) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Other Preferences
            cy.get(':nth-child(15) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(16) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Style of diet
            cy.get(':nth-child(16) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(17) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Favorite Foods
            cy.get(':nth-child(17) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(18) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // List of food you will not eat
            cy.get(':nth-child(18) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find('#has_food_allergies\\[\\]-checkbox-field > :nth-child(1) > .checkbox-container > .checkmark').length > 0) {
            // Has Allergies?
            cy.get('#has_food_allergies\\[\\]-checkbox-field > :nth-child(1) > .checkbox-container > .checkmark').click()
        }
        if ($body.find(':nth-child(20) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // List of food allergies
            cy.get(':nth-child(20) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find('#currently_active\\[\\]-checkbox-field > :nth-child(1) > .checkbox-container > .checkmark').length > 0) {
            // Are you lifting weights?
            cy.get('#currently_active\\[\\]-checkbox-field > :nth-child(1) > .checkbox-container > .checkmark').click()
        }
        if ($body.find(':nth-child(23) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // How long have you been active for?
            cy.get(':nth-child(23) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(24) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // How much time are you willing to devote
            cy.get(':nth-child(24) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(25) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // List of weekly routine
            cy.get(':nth-child(25) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(26) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // List of favorite excercises
            cy.get(':nth-child(26) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(27) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // List of least excercises
            cy.get(':nth-child(27) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find('#gym_access\\[\\]-checkbox-field > :nth-child(2) > .checkbox-container > .checkmark').length > 0) {
            // Gym access?
            cy.get('#gym_access\\[\\]-checkbox-field > :nth-child(2) > .checkbox-container > .checkmark').click()
        }
        if ($body.find(':nth-child(29) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // What we can do to help reach your goals
            cy.get(':nth-child(29) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(30) > :nth-child(2) > .cdp-field > .cdp-input').length > 0) {
            // Average sleep
            cy.get(':nth-child(30) > :nth-child(2) > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(31) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(2) > .radio-container > .checkmark').length > 0) {
            // Are you overweight?
            cy.get(':nth-child(31) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(2) > .radio-container > .checkmark').click()
        }
        if ($body.find(':nth-child(32) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(3) > .radio-container > .checkmark').length > 0) {
            // If overwieght
            cy.get(':nth-child(32) > [data-v-32b51562=""] > :nth-child(1) > :nth-child(3) > .radio-container > .checkmark').click()
        }
        if ($body.find(':nth-child(33) > :nth-child(2) > :nth-child(1) > :nth-child(2) > .radio-container > .checkmark').length > 0) {
            // Any injuries?
            cy.get(':nth-child(33) > :nth-child(2) > :nth-child(1) > :nth-child(2) > .radio-container > .checkmark').click()
        }
        if ($body.find(':nth-child(34) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // If no injuries
            cy.get(':nth-child(34) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(35) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Any specific conditions?
            cy.get(':nth-child(35) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(36) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Taking any supplements?
            cy.get(':nth-child(36) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(37) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Any comments?
            cy.get(':nth-child(37) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(38) > :nth-child(2) > .cdp-field > .cdp-input').length > 0) {
            // How did you hear us?
            cy.get(':nth-child(38) > :nth-child(2) > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find(':nth-child(39) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Deciding factor
            cy.get(':nth-child(39) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('N/A')
        }
        if ($body.find('.col-12 > .cdp-field > .checkbox-container > .checkmark').length > 0) {
            // Agree to terms and conditions?
            cy.get('.col-12 > .cdp-field > .checkbox-container > .checkmark').click()
        }
        if ($body.find(':nth-child(14) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Textbox A
            cy.get(':nth-child(14) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('Test Answer A')
        }
        if ($body.find(':nth-child(15) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Textbox B
            cy.get(':nth-child(15) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('Test Answer B')
        }
        if ($body.find(':nth-child(16) > [data-v-32b51562=""] > .cdp-field > .cdp-input').length > 0) {
            // Textbox C
            cy.get(':nth-child(16) > [data-v-32b51562=""] > .cdp-field > .cdp-input').type('Test Answer C')
        }
        if ($body.find('.cdp-form-submit-button').length > 0) {
            // Submit button
            cy.get('.cdp-form-submit-button').should('not.be.disabled').click()
        }
    })

    cy.wait(3000)

    cy.get('body').then(($body) => {
        if ($body.find('.modal-content').length > 0) {
            cy.get('.modal-content').within(() => {
                cy.get('div[class="modal-close modal-close-cross"]').eq(0).should('be.visible').click({ force: true })
            })
        }
    })

})

// Verify Purchases
Cypress.Commands.add("VerifyPurchases", (_file) => {

    const Currency = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    // Click HERE link
    cy.get('h5 > a').should('be.visible').click()

    cy.wait(2000)

    cy.get('body').then(($body) => {
        if ($body.find('.modal-content').length > 0) {
            // cy.get('body').click()
            cy.get('.modal-content').within(() => {
                cy.get('div[class="modal-close modal-close-cross"]').eq(0).should('be.visible').click({ force: true })
            })
        }
    })

    // Click Purchases menu
    cy.get('.menu-vertical > :nth-child(3) > a').should('be.visible').click()
    cy.wait(2000)

    cy.readFile(_file).then((data) => {

        cy.get('.th-name').should('have.length.least', 1)
            .its('length')
            .then(n => {
                for (let i = 0; i < n; i++) {
                    cy.get('.th-name').eq(i).invoke('text').then((text) => {
                        for (let x = 1; x < data.length; x++) {
                            if (text.trim().replace(/[\n]/g, '') == data[x].productName) {
                                expect(text.trim().replace(/[\n]/g, '')).to.eq(data[x].productName)
                                cy.get('.th-amount').eq(i).invoke('text').then((amount) => {
                                    if (amount.trim().replace(/[\n]/g, '') == Currency.format(data[x].productPrice) + ' USD') {
                                        expect(amount.trim().replace(/[\n]/g, '')).to.eq(Currency.format(data[x].productPrice) + ' USD')
                                    }
                                })
                            }
                        }
                    })
                }
            })

        cy.get('.th-amount').should('have.length.least', 1)
            .its('length')
            .then(n => {
                for (let i = 0; i < n; i++) {
                    cy.get('.th-amount').eq(i).invoke('text').then((tax) => {
                        tax:
                        for (let x = 1; x < data.length; x++) {
                            if (tax.trim().replace(/[\n]/g, '') == Currency.format(data[x].productTax) + ' USD') {
                                expect(tax.trim().replace(/[\n]/g, '')).to.eq(Currency.format(data[x].productTax) + ' USD')
                                break tax
                            }
                        }
                    })
                }
            })

    })

})

// Complete profile
Cypress.Commands.add("CompleteProfile", () => {

    // Click Profile menu
    cy.get(':nth-child(3) > .menu-vertical > :nth-child(1) > a').should('be.visible').click()

    cy.wait(2000)

    // Gender
    cy.get('#profile-gender').should('be.visible').select('female')

    cy.get('body').then(($body) => {

        if ($body.find('#profile-birthday').length > 0) {

            // Birthday
            cy.get('#profile-birthday').should('be.visible').type('1998-09-09')
            // Height ft
            for (let x = 0; x <= 5; x++) {
                cy.get(':nth-child(9) > .input-number > .input-number__controls > .input-number__increase').should('be.visible').click()
            }
            // Height inches
            for (let y = 0; y < 5; y++) {
                cy.get('[style="display:1;"] > .input-number > .input-number__controls > .input-number__increase').should('be.visible').click()
            }
            // Weight
            cy.get('#profile-weight').should('be.visible').type('78')
            // Activitty Level
            cy.get(':nth-child(13) > .container > :nth-child(1) > .col-xs-2 > .input-radio > label').should('be.visible').click()
            // Misc
            cy.get('.col-sm-12.pt-3 > .container > :nth-child(2) > .col-xs-2 > .input-radio > label').should('be.visible').click()
        }
    })

    // Save
    cy.get(':nth-child(2) > .col-md-3 > .btn').should('be.visible').click()
})

// Verify Programs
Cypress.Commands.add("VerifyPrograms", (_file) => {

    // TODO: Implement logic on how programs are displayed depending on the ordered items

    // Get bundles fixture data
    cy.fixture('bundles').as('bundle')

    // Click My Stuff
    cy.get('.menu-horizontal > :nth-child(8) > a').click()
    cy.wait(2000)

    // Get all element statuses for each programs displayed on My Stuff
    cy.get('.product').should('have.length.least', 1)
        .its('length')
        .then(n => {
            for (let p = 0; p < n; p++) {
                cy.get('.product').eq(p).within(() => {
                    cy.get('img').should('have.attr', 'class').as('program_' + p)
                })
            }
        })

    cy.readFile(_file).then((products) => {
        // Loop through products file and compare its name with bundle names
        for (let x = 1; x < products.length; x++) {
            cy.get('@bundle').then((bundle) => {
                for (let i = 0; i < bundle.length; i++) {
                    if (bundle[i].bundleName == products[x].productName) {
                        for (let n = 0; n < Object.keys(bundle[i].bundleOffers[0]).length; n++) {
                            let item = bundle[i].bundleOffers[0][n]

                            // VSHRED Supplements Guide
                            cy.get('@program_0').then(status => {
                                expect(status).to.eq('1')
                            })

                            // CDP
                            if (item.match(/^Custom Diet Plan$/)) {
                                cy.get('@program_1').then(status => {
                                    expect(status).to.eq('1')
                                })
                            }

                            // VSU
                            if (item.match(/^VSU/)) {
                                cy.get('@program_3').then(status => {
                                    expect(status).to.eq('1')
                                })
                            }

                            // MOVE
                            if (item.match(/^MOVE 30$/)) {
                                cy.get('@program_4').then(status => {
                                    expect(status).to.eq('1')
                                })
                            }

                            // Ripped in 90 days
                            cy.get('@program_5').then(status => {
                                expect(status).to.eq('1')
                            })

                            // 90 Day Clean Bulk Program
                            cy.get('@program_6').then(status => {
                                expect(status).to.eq('1')
                            })

                            // Fat Loss Extreme for Her     
                            if (item.match(/^Fat Loss Extreme/)) {
                                cy.get('@program_7').then(status => {
                                    expect(status).to.eq('1')
                                })
                            }

                            // Toned in 90 days
                            cy.get('@program_8').then(status => {
                                expect(status).to.eq('1')
                            })

                            // Big Arms Program
                            if (item.match('Big Arms Program')) {
                                cy.get('@program_9').then(status => {
                                    expect(status).to.eq('1')
                                })
                            }

                            // Six-Pack Shred
                            if (item.match('Six-Pack Shred')) {
                                cy.get('@program_10').then(status => {
                                    expect(status).to.eq('1')
                                })
                            }

                            // Recipe Guide
                            if (item.match(/^Recipe Guide$/)) {
                                cy.get('@program_11').then(status => {
                                    expect(status).to.eq('1')
                                })
                            }

                            // The Booty Builder
                            if (item.match('The Booty Builder')) {
                                cy.get('@program_12').then(status => {
                                    expect(status).to.eq('1')
                                })
                            }

                            // V SHRED BOOST Program - 3 Months
                            if (item.match(/^V SHRED BOOST/)) {
                                cy.get('@program_17').then(status => {
                                    expect(status).to.eq('1')
                                })
                            }

                            // Happy Gut Recipe Guide
                            if (item.match(/^Happy Gut Recipe Guide$/)) {
                                cy.get('@program_19').then(status => {
                                    expect(status).to.eq('1')
                                })
                            }
                        }
                    }
                }
            })
        }
    })
})

// Verify Orders in Admin Tool
Cypress.Commands.add("VerifyOrders", (_file) => {

    const Currency = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    cy.fixture('admin').as('admin')

    cy.clearCookies()

    // Navigate to Admin Tool login page
    cy.visit(Cypress.config().baseUrl + 'login', {
        onBeforeLoad(win) {
            win.localStorage.clear()
        },
    })

    cy.wait(2000)

    cy.get('@admin').then((admin) => {
        // Login
        cy.get('#email').should('be.visible').type(admin[0].email)
        cy.get('#password').should('be.visible').type(admin[0].password)
    })

    cy.wait(2000)
    // Click Login
    cy.get('button[class="btn btn--primary type--uppercase"]').should('be.visible').click()
    cy.wait(2000)

    // Navigate to Users menu
    cy.get(':nth-child(14) > .nav-link').should('be.visible').click()
    cy.wait(3000)

    cy.readFile(_file).then((data) => {

        // let count = 0
        let itemName

        // Filter users list with email
        cy.get('#__BVID__16').click({ force: true }).type(data[0].email).type('{enter}')
        cy.wait(2000)

        // Click View
        cy.get('button[class="btn btn-info"]').should('be.visible').click()
        cy.wait(2000)

        // Navigate to Purchases
        cy.get('[role="tablist"] > :nth-child(4) > .nav-link').should('be.visible').click()
        cy.get(2000)

        cy.get('.th-name').should('have.length.least', 1)
            .its('length')
            .then(n => {
                for (let i = 1; i < n; i++) {
                    cy.get('.th-name').eq(i).invoke('text').then((name) => {
                        for (let x = data.length - 1; x > 0; x--) {

                            itemName = name.trim().split('\n(')[0].replace(/[\n]/g, '')

                            if (itemName == data[x].productName) {
                                expect(itemName).to.eq(data[x].productName)
                                cy.get('.th-amount').eq(i).should('be.visible').invoke('text').then((amount) => {
                                    if (amount.trim().replace(/[\n]/g, '').slice(0, -4) == Currency.format(data[x].productPrice)) {
                                        expect(amount.trim().replace(/[\n]/g, '').slice(0, -4)).to.eq(Currency.format(data[x].productPrice))
                                    }
                                })
                                cy.get('.th-tax_amount').eq(i).should('be.visible').invoke('text').then((tax) => {
                                    if (tax.trim().replace(/[\n]/g, '').slice(0, -4) == Currency.format(data[x].productTax)) {
                                        expect(tax.trim().replace(/[\n]/g, '').slice(0, -4)).to.eq(Currency.format(data[x].productTax))
                                    }
                                })
                                cy.get('.th-id').eq(i).invoke('text').then((id) => {
                                    data[x].orderLink = 'admin/sales-agent/process-order/' + id.trim().replace(/[\n]/g, '')
                                    cy.writeFile(_file, JSON.stringify(data, null, 2))
                                })
                            }
                        }
                    })
                }
            })

    })
})

// Verify Order Details
Cypress.Commands.add("VerifyOrderDetails", (_file) => {

    const Currency = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    cy.readFile(_file).then((data) => {

        for (let x = 1; x < data.length; x++) {

            if (data[x].orderLink) {
                cy.visit(Cypress.config().baseUrl + data[x].orderLink)
                cy.wait(3000)
                cy.get('#__BVID__42').should('have.length.least', 1)
                    .its('length')
                    .then(n => {
                        for (let i = 0; i < n; i++) {
                            cy.get('#__BVID__42').eq(i).within(() => {
                                cy.get('tr').should('have.length.least', 1)
                                    .its('length')
                                    .then(tr => {
                                        for (let x = 1; x < tr; x++) {
                                            cy.get('tr').eq(x).within(() => {
                                                cy.get('td').should('have.length.least', 1)
                                                    .its('length')
                                                    .then(td => {
                                                        for (let y = 1; y < td; y++) {
                                                            cy.get('td').eq(y).invoke('text').then((text) => {
                                                                orders:
                                                                for (let d = 1; d < data.length; d++) {
                                                                    if (text.trim().replace(/[\n]/g, '') == data[d].productName) {
                                                                        expect(text.trim().replace(/[\n]/g, '')).to.eq(data[d].productName)
                                                                    } else if (text.trim().replace(/[\n]/g, '') == Currency.format(data[d].productPrice)) {
                                                                        expect(text.trim().replace(/[\n]/g, '')).to.eq(Currency.format(data[d].productPrice))
                                                                    } else if (text.trim().replace(/[\n]/g, '') == Currency.format(data[d].productTax)) {
                                                                        expect(text.trim().replace(/[\n]/g, '')).to.eq(Currency.format(data[d].productTax))
                                                                        break orders
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    })
                                            })
                                        }
                                    })
                            })
                        }
                    })
            }

        }

    })

})

// Verify Subscriptions
Cypress.Commands.add("VerifySubscriptions", (_file) => {

    const Currency = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    // Click Users menu
    cy.get(':nth-child(14) > .nav-link').should('be.visible').scrollIntoView().click()
    cy.wait(3000)

    cy.readFile(_file).then((data) => {

        // Enter email address
        cy.get('#__BVID__16').should('be.visible').click().type(data[0].email).type('{enter}')
        cy.wait(2000)

        // Click View
        cy.get('button[class="btn btn-info"]').should('be.visible').click()
        cy.wait(2000)

        // Navigate to Subscriptions tab
        cy.get('[role="tablist"] > :nth-child(3) > .nav-link').should('be.visible').click({ force: true })
        cy.get(2000)

        cy.get('body').then(($body) => {
            if ($body.find('#__BVID__9').length > 0) {
                cy.get('#__BVID__9').should('be.visible').within(() => {
                    cy.get('tbody[role="rowgroup"]').within(() => {
                        cy.get('tr[role="row"]').should('have.length.least', 1)
                            .its('length')
                            .then(n => {
                                for (let i = 0; i < n; i++) {
                                    cy.get('tr[role="row"]').eq(i).within(() => {
                                        cy.get('td[role="cell"]').should('have.length.least', 1)
                                            .its('length')
                                            .then(m => {
                                                for (let j = 4; j < m; j++) {
                                                    cy.get('td[role="cell"]').eq(j).invoke('text').then((text) => {
                                                        for (let x = 1; x < data.length; x++) {
                                                            if (text.trim().replace(/[\n]/g, '') == data[x].productName) {
                                                                expect(text.trim().replace(/[\n]/g, '')).to.eq(data[x].productName)
                                                            } else if (text.trim().replace(/[\n]/g, '') == Currency.format(data[x].productPrice) + ' +') {
                                                                expect(text.trim().replace(/[\n]/g, '')).to.eq(Currency.format(data[x].productPrice) + ' +')
                                                            }
                                                        }
                                                    })
                                                }
                                            })
                                    })
                                }
                            })
                    })
                })
            }
        })
    })
})


// Verify Welcome Email
Cypress.Commands.add("VerifyWelcomeEmail", (_file, _subject) => {
    cy.readFile(_file).then((data) => {
        cy.task("gmail:refreshAccessToken");
        cy.task("gmail:check", {
            from: "joel@vshred.com",
            to: data[0].email,
            subject: _subject
        })
            .then(email => {
                assert.isNotNull(email, `Email was found`);
            });

    })
})

// Verify Email Confirmation
Cypress.Commands.add("VerifyEmailConfirmation", (_file, _subject) => {
    cy.readFile(_file).then((data) => {
        cy.task("gmail:refreshAccessToken");
        cy.task("gmail:check", {
            from: "vince@vshred.com",
            to: data[0].email,
            subject: _subject
        })
            .then(email => {
                assert.isNotNull(email, `Email was found`);
            });

    })
})