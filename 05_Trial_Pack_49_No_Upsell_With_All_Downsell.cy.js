Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

/*
  Page Flow
  Landing Page Trial Pack $49 > 
  Burn Evovled NO Upsell > 
  Burn PM Downsell >
  Turmeric Downsell > 
  Enzymes Downsell
*/

describe('05 New Year Special VIP Sale - V1', () => {

  let user

  const uuid = () => Cypress._.random(0, 1e5)
  const id = uuid()

  before(() => {
    cy.fixture('users').then((users) => {
      user = users
    })

  })

  it('Verify $49 Trial Pack NO Upsells With Downsells', () => {

    const file = 'cypress/e2e/data/regression/newyear_special_vip_sale/original/newyear_special_vip_sale_orders.json'

    cy.writeFile(file, [])

    cy.clearCookies()

    cy.window().then((win) => {
      win.sessionStorage.clear()
    })

    Cypress.session.clearAllSavedSessions()

    cy.clearLocalStorage()

    // Landing Page
    cy.visit(Cypress.config().baseUrl + 'sp/newyears/special-offer-eco-fbk-cpc?qa_test=VSQAT', {
      onBeforeLoad(win) {
        win.localStorage.clear()
      },
    })

    // Verify Landing Page
    cy.VerifyURL('sp/newyears/special-offer-eco-fbk-cpc')

    // Click Buy Now on $49 Trial Pack
    cy.ClickButton(':nth-child(6) > .packages11__totalContainer > :nth-child(1) > .packages11__item--footer > .packages11__item--footer__cta > div')

    // Verify Order Form
    cy.VerifyURL('/order-form/bun-burn-burnpm-acvgummies')
    
    // Name
    cy.EnterText('#name', user.firstName + ' ' + user.lastName)
    // Email
    cy.EnterText('#email', 'tests+' + id + '@vshred.com')

    // Click Next Step Button
    cy.ClickButton(':nth-child(3) > .expand-area > .expand-inputs > .next-step')

    // Enter Shipping Address
    cy.EnterText('#shipping_name', user.firstName + ' ' + user.lastName)
    cy.EnterText('#shipping_street1', user.shippingAddress1)
    cy.EnterText('#shipping_street2', user.shippingAddress2)
    cy.EnterText('#shipping_city', user.shippingCity)
    cy.SelectDropDown('#shipping_state_us', user.shippingState)
    cy.EnterText('#shipping_postal_code', user.shippingPostCode)
    cy.SelectDropDown('#shipping_country', user.shippingCountry)
    cy.EnterText('#shipping_phone', user.shippingPhone)

    // Click Next Step Button
    cy.ClickButton('.expand-area-2 > .expand-inputs > .next-step')

    // Enter Payment Details
    cy.EnterPaymentDetails()

    // Save User Info
    cy.SaveUserInfo(file, 'tests+' + id + '@vshred.com')

    // Save Order Details
    cy.SaveOrderDetails(user, file, 'TRIAL PACK - Burn Evolved + Burn PM (FREE) + ACV Gummies (FREE)', '1', '49.00', 'physical')

    // Click Next Step Button
    cy.ClickButton('.expand-area-3 > .expand-inputs > .next-step')

    // Verify Order Summary
    cy.VerifyOrderSummary(file)

    // Click Submit Order
    cy.ClickButton('#submit-order')

    // --------- Burn Evolved Upsell ---------

    // Verify Next URL
    cy.VerifyNextURL('sp/burn/burn-us-1-3')

    // Skip Video
    cy.SkipVideo()

    // Click Yes Upgrade My Oder
    // cy.ClickButton(':nth-child(5) > .btn')

    // Or Decline this Offer
    cy.ClickButton('u')

    // Save Order Details
    // cy.SaveOrderDetails(user, file, 'Burn Evolved', '1', '72.00', 'physical')

    // --------- Burn PM Downsell ---------

    // Verify Next URL
    cy.VerifyNextURL('sp/burn/burn-pm-cs-1')

    // Skip Video
    cy.SkipVideo()

    // Select this Offer
    cy.ClickButton(':nth-child(5) > .btn')

    // Or Decline this Offer
    // cy.ClickButton('u > b')

    // Save Order Details
    cy.SaveOrderDetails(user, file, 'Burn PM', '1', '24.00', 'physical')

    // --------- Turmeric Downsell ---------

    // Verify Next URL
    cy.VerifyNextURL('sp/burn/turmeric-cs-1')

    // Skip Video
    cy.SkipVideo()

    // Select this Offer
    cy.ClickButton(':nth-child(5) > .btn')

    // Or Decline this Offer
    // cy.ClickButton('u > b')

    // Save Order Details
    cy.SaveOrderDetails(user, file, 'Turmeric Black', '1', '24.00', 'physical')

    // --------- Enzymes Downsell ---------

    // Verify Next URL
    cy.VerifyNextURL('sp/burn/enzymes-cs-1')

    // Skip Video
    cy.SkipVideo()

    // Select this Offer
    cy.ClickButton(':nth-child(5) > .btn')

    // Or Decline this Offer
    // cy.ClickButton('u > b')

    // Save Order Details
    cy.SaveOrderDetails(user, file, 'Enzymes', '1', '24.00', 'physical')
    
    // Verify Order Confirmation page
    cy.VerifyOrderConfirmation(file)

    // Verify Purchases
    cy.VerifyPurchases(file)

    // Complete Profile
    cy.CompleteProfile()

    // Verify Programs
    cy.VerifyPrograms(file)

    // Verify Orders in Admin
    cy.VerifyOrders(file)

    // Verify Order Details in Admin
    cy.VerifyOrderDetails(file)

    // Verify Subscriptions in Admin
    cy.VerifySubscriptions(file)

    // Verify Wecome Email
    cy.VerifyEmailConfirmation(file, 'WELCOME!')
 
    // Verify Order Email Confirmation
    cy.VerifyEmailConfirmation(file, 'Your V Shred order has been received!')
 
  })

})