


const { I } = inject();
// Add in your custom step files

Given('I have a defined step', () => {
  // TODO: replace with your own step
    I.amOnPage('/');
    I.wait(3);
    I.click('(//a[contains(text(),"Sign in")])[2]')
    I.wait(3);

});
When(/^I do something$/, function () {

});
Given(/^I am in BTC$/, function () {

});
When(/^I login with valid credentials$/, function () {
    I.amOnPage('/');
    I.wait(5);
    I.fillField('input[id="1-email"]','asdadsa');
    I.fillField('input[id="1-password"]','asdadsa');
    I.wait(5);
    // id="1-email"
    // id="1-password"
    // id="1-submit"
});