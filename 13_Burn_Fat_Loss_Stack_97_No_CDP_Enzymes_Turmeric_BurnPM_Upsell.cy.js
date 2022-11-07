Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

/*
  Page Flow
  Landing Page Burn Fat Loss Stack $97 > 
  Burn Evovled Upsell > 
  Burn PM Upsell >
  No Turmeric Upsell > 
  No Enzymes Upsell >
  No CDP Upsell
*/

describe('13 New Year Special VIP Sale - V1', () => {

  let user

  const uuid = () => Cypress._.random(0, 1e5)
  const id = uuid()

  before(() => {
    cy.fixture('users').then((users) => {
      user = users
    })

  })

  it('Verify $97 Burn Fat Loss Stack No CDP, Enzymes, Turmeric & Burn PM Upsell', () => {

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
 
    // Click Buy Now on Burn Fat Loss Stack $97
    cy.ClickButton(':nth-child(6) > .packages11__totalContainer > :nth-child(2) > .packages11__item--footer > .packages11__item--footer__cta > div')

    // Verify Order Form
    cy.VerifyURL('/order-form/bun-burn-burnpm-acvgummies-blender')

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
    cy.SaveOrderDetails(user, file, 'BURN FAT LOSS STACK - Burn Evolved (3) + Burn PM (3) (FREE) + ACV Gummies (FREE) + VSHRED Shaker Bottle (FREE)', '1', '97.00', 'physical')

    // Click Next Step Button
    cy.ClickButton('.expand-area-3 > .expand-inputs > .next-step')

    // Verify Order Summary
    cy.VerifyOrderSummary(file)

    // Click Submit Order
    cy.ClickButton('#submit-order')

    // --------- Burn Evolved Upsell ---------

    // Verify Next URL
    cy.VerifyNextURL('sp/burn-evolved/burn-us-3-3')

    // Skip Video
    cy.SkipVideo()

    // Click Yes Upgrade My Oder
    cy.ClickButton(':nth-child(5) > .btn')

    // Or Decline this Offer
    // cy.ClickButton('u')

    // Save Order Details
    cy.SaveOrderDetails(user, file, 'Burn Evolved', '1', '72.00', 'physical')

    // --------- Burn PM Upsell ---------

    // Verify Next URL
    cy.VerifyNextURL('sp/burn-evolved/burn-pm-cs-6')

    // Skip Video
    cy.SkipVideo()

    // Select this Offer
    // cy.ClickButton(':nth-child(5) > .btn')

    // Or Decline this Offer
    cy.ClickButton('u > b')

    // Save Order Details
    // cy.SaveOrderDetails(user, file, 'Burn PM', '1', '144.00', 'physical')

    // --------- Turmeric Upsell ---------

    // Verify Next URL
    cy.VerifyNextURL('sp/burn-evolved/turmeric-cs-6')

    // Skip Video
    cy.SkipVideo()

    // Select this Offer
    // cy.ClickButton(':nth-child(5) > .btn')

    // Or Decline this Offer
    cy.ClickButton('u > b')

    // Save Order Details
    // cy.SaveOrderDetails(user, file, 'Turmeric Black', '1', '144.00', 'physical')

    // --------- Enzymes Upsell ---------

    // Verify Next URL
    cy.VerifyNextURL('sp/burn-evolved/enzymes-cs-6')

    // Skip Video
    cy.SkipVideo()

    // Select this Offer
    // cy.ClickButton(':nth-child(5) > .btn')

    // Or Decline this Offer
    cy.ClickButton('u > b')

    // Save Order Details
    // cy.SaveOrderDetails(user, file, 'Enzymes', '1', '144.00', 'physical')

    // --------- Fat Loss CDP Upsell ---------

    // Verify Next URL
    cy.VerifyNextURL('sp/fat-loss-extreme/fl-cdp-us-v3')

    // Skip Video
    cy.SkipVideo()

    // Select this Offer
    // cy.ClickButton('.container > .btn')

    // Or Decline this Offer
    cy.ClickButton('.container > a')

    // Save Order Details
    // cy.SaveOrderDetails(user, file, 'Custom Diet Plan', '1', '49.00', 'digital')

    // ---------------------------------------

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