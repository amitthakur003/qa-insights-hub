// QA Dashboard Database - Simulating MongoDB Structure
// This file represents the comprehensive data structure for the QA Analytics system

export interface BugInfo {
  severity: "P1" | "P2" | "P3";
  error_log: string;
  ai_analysis: string;
}

export interface TestCase {
  tc_id: string;
  title: string;
  status: "Passed" | "Failed" | "Flaky";
  bug_info: BugInfo | null;
  script_content: string;
}

export interface Feature {
  feature_id: string;
  feature_name: string;
  test_cases: TestCase[];
}

export interface Module {
  module_id: string;
  module_name: string;
  features: Feature[];
}

export interface Build {
  build_id: string;
  build_date: string;
  total_modules: number;
  total_features: number;
  total_test_cases: number;
  modules: Module[];
}

export interface ReleaseCycle {
  release_cycle_name: string;
  project_code: string;
  builds: Build[];
}

// Full comprehensive mock data matching user's exact structure
export const qaDatabase: ReleaseCycle = {
  release_cycle_name: "Release Cycle 2025-Q1",
  project_code: "ECOMM_PRO_X",
  builds: [
    {
      build_id: "B-4.5.2",
      build_date: "2025-12-20T14:00:00Z",
      total_modules: 5,
      total_features: 10,
      total_test_cases: 50,
      modules: [
        {
          module_id: "MOD_01",
          module_name: "Authentication",
          features: [
            {
              feature_id: "FEAT_01_01",
              feature_name: "User Login",
              test_cases: [
                {
                  tc_id: "TC_001",
                  title: "Valid Login",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver
from selenium.webdriver.common.by import By

def test_valid_login():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/login')
    driver.find_element(By.ID, 'email').send_keys('user@demo.com')
    driver.find_element(By.ID, 'password').send_keys('Pass1234')
    driver.find_element(By.ID, 'btn-login').click()
    assert 'Dashboard' in driver.title
    driver.quit()`
                },
                {
                  tc_id: "TC_002",
                  title: "Invalid Password",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver
from selenium.webdriver.common.by import By

def test_invalid_pass():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/login')
    driver.find_element(By.ID, 'email').send_keys('user@demo.com')
    driver.find_element(By.ID, 'password').send_keys('WrongPass')
    driver.find_element(By.ID, 'btn-login').click()
    error = driver.find_element(By.CLASS_NAME, 'alert-error').text
    assert 'Invalid credentials' in error
    driver.quit()`
                },
                {
                  tc_id: "TC_003",
                  title: "Empty Fields Validation",
                  status: "Failed",
                  bug_info: {
                    severity: "P2",
                    error_log: "AssertionError: Validation message missing",
                    ai_analysis: "The frontend is not triggering the JS validation for empty fields; server returns 500 error instead of client-side warning."
                  },
                  script_content: `from selenium import webdriver
from selenium.webdriver.common.by import By

def test_empty_login():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/login')
    driver.find_element(By.ID, 'btn-login').click()
    # BUG: Page crashes instead of showing validation
    msg = driver.find_element(By.ID, 'email-error').text
    assert 'Email is required' in msg
    driver.quit()`
                },
                {
                  tc_id: "TC_004",
                  title: "SQL Injection Attempt",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver
from selenium.webdriver.common.by import By

def test_sql_inject():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/login')
    driver.find_element(By.ID, 'email').send_keys("' OR 1=1 --")
    driver.find_element(By.ID, 'password').send_keys('random')
    driver.find_element(By.ID, 'btn-login').click()
    assert 'Dashboard' not in driver.title
    driver.quit()`
                },
                {
                  tc_id: "TC_005",
                  title: "Login with Locked Account",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver
from selenium.webdriver.common.by import By

def test_locked_user():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/login')
    driver.find_element(By.ID, 'email').send_keys('locked@demo.com')
    driver.find_element(By.ID, 'password').send_keys('Pass1234')
    driver.find_element(By.ID, 'btn-login').click()
    assert 'Account Locked' in driver.page_source
    driver.quit()`
                }
              ]
            },
            {
              feature_id: "FEAT_01_02",
              feature_name: "Sign Up / Registration",
              test_cases: [
                {
                  tc_id: "TC_006",
                  title: "Successful Registration",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_register_success():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/register')
    # ... fill form logic ...
    driver.find_element(By.ID, 'btn-signup').click()
    assert 'Welcome' in driver.title
    driver.quit()`
                },
                {
                  tc_id: "TC_007",
                  title: "Duplicate Email Check",
                  status: "Failed",
                  bug_info: {
                    severity: "P1",
                    error_log: "DuplicateEntryException: DB Constraint Violation",
                    ai_analysis: "The backend API is not catching the duplicate email before hitting the database, causing a crash."
                  },
                  script_content: `from selenium import webdriver

def test_dup_email():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/register')
    driver.find_element(By.ID, 'email').send_keys('existing@test.com')
    driver.find_element(By.ID, 'btn-signup').click()
    # BUG: 500 Error Page displayed
    assert 'Email already exists' in driver.page_source
    driver.quit()`
                },
                {
                  tc_id: "TC_008",
                  title: "Weak Password Validation",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_weak_pass():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/register')
    driver.find_element(By.ID, 'password').send_keys('123')
    assert 'Password too weak' in driver.find_element(By.ID, 'pass-error').text
    driver.quit()`
                },
                {
                  tc_id: "TC_009",
                  title: "Terms of Service Checkbox",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_tos_checkbox():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/register')
    driver.find_element(By.ID, 'btn-signup').click()
    assert 'Accept TOS' in driver.page_source
    driver.quit()`
                },
                {
                  tc_id: "TC_010",
                  title: "Email Format Validation",
                  status: "Failed",
                  bug_info: {
                    severity: "P3",
                    error_log: "AssertionError: Regex validation failed",
                    ai_analysis: "The regex pattern allows emails without dots (e.g. user@com) which should be invalid."
                  },
                  script_content: `from selenium import webdriver

def test_email_format():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/register')
    driver.find_element(By.ID, 'email').send_keys('user@com')
    driver.find_element(By.ID, 'btn-signup').click()
    # BUG: It accepts the email
    assert 'Invalid Email' in driver.find_element(By.ID, 'email-error').text
    driver.quit()`
                }
              ]
            }
          ]
        },
        {
          module_id: "MOD_02",
          module_name: "Product Catalog",
          features: [
            {
              feature_id: "FEAT_02_01",
              feature_name: "Search Functionality",
              test_cases: [
                {
                  tc_id: "TC_011",
                  title: "Search by Exact Name",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_search_exact():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com')
    driver.find_element(By.NAME, 'q').send_keys('iPhone 15')
    driver.find_element(By.CLASS_NAME, 'search-icon').click()
    assert 'iPhone 15' in driver.find_element(By.CLASS_NAME, 'product-title').text
    driver.quit()`
                },
                {
                  tc_id: "TC_012",
                  title: "Search No Results",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_search_empty():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com')
    driver.find_element(By.NAME, 'q').send_keys('xyz123random')
    driver.find_element(By.CLASS_NAME, 'search-icon').click()
    assert 'No results found' in driver.page_source
    driver.quit()`
                },
                {
                  tc_id: "TC_013",
                  title: "Search Special Characters",
                  status: "Failed",
                  bug_info: {
                    severity: "P2",
                    error_log: "500 Internal Server Error",
                    ai_analysis: "The search query is not sanitized against special characters like %, causing a DB syntax error."
                  },
                  script_content: `from selenium import webdriver

def test_search_special():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com')
    driver.find_element(By.NAME, 'q').send_keys('%%%')
    driver.find_element(By.CLASS_NAME, 'search-icon').click()
    # BUG: Server crashes
    assert 'Internal Server Error' not in driver.page_source
    driver.quit()`
                },
                {
                  tc_id: "TC_014",
                  title: "Search Autosuggest",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_autosuggest():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com')
    driver.find_element(By.NAME, 'q').send_keys('Sam')
    time.sleep(1)
    suggestions = driver.find_elements(By.CLASS_NAME, 'suggestion-item')
    assert len(suggestions) > 0
    driver.quit()`
                },
                {
                  tc_id: "TC_015",
                  title: "Search Case Insensitivity",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_search_case():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com')
    driver.find_element(By.NAME, 'q').send_keys('iphone')
    driver.find_element(By.CLASS_NAME, 'search-icon').click()
    assert 'iPhone' in driver.page_source
    driver.quit()`
                }
              ]
            },
            {
              feature_id: "FEAT_02_02",
              feature_name: "Product Filters",
              test_cases: [
                {
                  tc_id: "TC_016",
                  title: "Filter by Price Range",
                  status: "Failed",
                  bug_info: {
                    severity: "P1",
                    error_log: "AssertionError: Products outside range displayed",
                    ai_analysis: "The 'Max Price' filter logic is inverted in the backend query (Min > Val instead of Max < Val)."
                  },
                  script_content: `from selenium import webdriver

def test_filter_price():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/products')
    driver.find_element(By.ID, 'price-max').send_keys('100')
    driver.find_element(By.ID, 'btn-filter').click()
    prices = [int(p.text) for p in driver.find_elements(By.CLASS_NAME, 'price')]
    # BUG: Shows items costing 500
    assert all(p <= 100 for p in prices)
    driver.quit()`
                },
                {
                  tc_id: "TC_017",
                  title: "Filter by Category",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_filter_category():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/products')
    driver.find_element(By.ID, 'chk-electronics').click()
    titles = driver.find_elements(By.CLASS_NAME, 'prod-title')
    # Verify all are electronics
    driver.quit()`
                },
                {
                  tc_id: "TC_018",
                  title: "Filter by Brand",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_filter_brand():
    # Script to click 'Samsung' checkbox
    # Assert all visible items are Samsung
    pass`
                },
                {
                  tc_id: "TC_019",
                  title: "Clear All Filters",
                  status: "Failed",
                  bug_info: {
                    severity: "P3",
                    error_log: "ElementNotInteractable",
                    ai_analysis: "The 'Clear Filters' button is overlapped by the chat widget on mobile viewports."
                  },
                  script_content: `from selenium import webdriver

def test_clear_filter():
    driver = webdriver.Chrome()
    driver.set_window_size(375, 812)
    driver.get('https://staging.shop.com/products')
    driver.find_element(By.ID, 'btn-clear').click()
    # BUG: Click intercepted
    driver.quit()`
                },
                {
                  tc_id: "TC_020",
                  title: "Multiple Filters Combination",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_multi_filter():
    # Apply Price + Brand + Category
    # Verify results match all criteria
    pass`
                }
              ]
            }
          ]
        },
        {
          module_id: "MOD_03",
          module_name: "Shopping Cart",
          features: [
            {
              feature_id: "FEAT_03_01",
              feature_name: "Cart Management",
              test_cases: [
                {
                  tc_id: "TC_021",
                  title: "Add Item to Cart",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_add_cart():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/product/1')
    driver.find_element(By.ID, 'add-to-cart').click()
    assert '1' in driver.find_element(By.ID, 'cart-badge').text
    driver.quit()`
                },
                {
                  tc_id: "TC_022",
                  title: "Remove Item from Cart",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_remove_cart():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/cart')
    driver.find_element(By.ID, 'remove-item-1').click()
    assert 'Cart is empty' in driver.page_source
    driver.quit()`
                },
                {
                  tc_id: "TC_023",
                  title: "Update Quantity",
                  status: "Failed",
                  bug_info: {
                    severity: "P2",
                    error_log: "AssertionError: Total price not updated",
                    ai_analysis: "The AJAX call to update the total price fails when quantity is changed rapidly."
                  },
                  script_content: `from selenium import webdriver

def test_update_qty():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/cart')
    input = driver.find_element(By.ID, 'qty-1')
    input.clear()
    input.send_keys('2')
    # BUG: Total price remains for 1 item
    assert driver.find_element(By.ID, 'total').text == '$200.00'
    driver.quit()`
                },
                {
                  tc_id: "TC_024",
                  title: "Add Out of Stock Item",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_add_oos():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/product/99')
    btn = driver.find_element(By.ID, 'add-to-cart')
    assert btn.get_attribute('disabled') == 'true'
    driver.quit()`
                },
                {
                  tc_id: "TC_025",
                  title: "Cart Persistence (Cookie)",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_cart_persist():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/product/1')
    driver.find_element(By.ID, 'add-to-cart').click()
    driver.refresh()
    assert '1' in driver.find_element(By.ID, 'cart-badge').text
    driver.quit()`
                }
              ]
            },
            {
              feature_id: "FEAT_03_02",
              feature_name: "Price Calculation",
              test_cases: [
                {
                  tc_id: "TC_026",
                  title: "Subtotal Calculation",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_subtotal():
    # Add 2 items of $50
    # Assert Subtotal is $100
    pass`
                },
                {
                  tc_id: "TC_027",
                  title: "Tax Calculation",
                  status: "Failed",
                  bug_info: {
                    severity: "P1",
                    error_log: "AssertionError: Tax calculated as 0",
                    ai_analysis: "The tax API service is timing out, defaulting to 0 tax instead of retrying."
                  },
                  script_content: `from selenium import webdriver

def test_tax_calc():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/cart')
    # BUG: Tax shows $0.00
    tax = driver.find_element(By.ID, 'tax-amt').text
    assert tax != '$0.00'
    driver.quit()`
                },
                {
                  tc_id: "TC_028",
                  title: "Shipping Cost Logic",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_shipping():
    # If total > $500, shipping should be free
    pass`
                },
                {
                  tc_id: "TC_029",
                  title: "Discount Code Application",
                  status: "Failed",
                  bug_info: {
                    severity: "P2",
                    error_log: "AssertionError: Discount applied twice",
                    ai_analysis: "Double-clicking the 'Apply Coupon' button sends two requests, stacking the discount."
                  },
                  script_content: `from selenium import webdriver

def test_coupon():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/cart')
    driver.find_element(By.ID, 'coupon').send_keys('SAVE10')
    driver.find_element(By.ID, 'apply').click()
    # BUG: Total reduced by 20% instead of 10%
    assert total == expected_total
    driver.quit()`
                },
                {
                  tc_id: "TC_030",
                  title: "Total Grand Sum",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_grand_total():
    # Assert Subtotal + Tax + Shipping - Discount == Total
    pass`
                }
              ]
            }
          ]
        },
        {
          module_id: "MOD_04",
          module_name: "Checkout & Payments",
          features: [
            {
              feature_id: "FEAT_04_01",
              feature_name: "Payment Gateway",
              test_cases: [
                {
                  tc_id: "TC_031",
                  title: "Credit Card Valid",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_cc_valid():
    # Switch to iframe
    # Fill CC details
    # Click Pay
    # Assert Success Page
    pass`
                },
                {
                  tc_id: "TC_032",
                  title: "Credit Card Declined",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_cc_decline():
    # Use Stripe Test Card for decline
    # Assert error message 'Card Declined'
    pass`
                },
                {
                  tc_id: "TC_033",
                  title: "Payment Timeout Handling",
                  status: "Failed",
                  bug_info: {
                    severity: "P1",
                    error_log: "TimeoutException: Spinner never disappears",
                    ai_analysis: "The frontend is not receiving the webhook callback from the payment provider."
                  },
                  script_content: `from selenium import webdriver

def test_timeout():
    driver = webdriver.Chrome()
    # ... payment steps ...
    # BUG: Spinner spins forever
    WebDriverWait(driver, 10).until(EC.invisibility_of_element_located((By.ID, 'spinner')))
    driver.quit()`
                },
                {
                  tc_id: "TC_034",
                  title: "PayPal Integration",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_paypal():
    # Click PayPal button
    # Assert redirect to paypal.com
    pass`
                },
                {
                  tc_id: "TC_035",
                  title: "Currency Conversion",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_currency():
    # Change currency to EUR
    # Assert Payment Gateway shows EUR
    pass`
                }
              ]
            },
            {
              feature_id: "FEAT_04_02",
              feature_name: "Order Placement",
              test_cases: [
                {
                  tc_id: "TC_036",
                  title: "Guest Checkout",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_guest_checkout():
    # Checkout without logging in
    # Assert Order Placed
    pass`
                },
                {
                  tc_id: "TC_037",
                  title: "Shipping Address Validation",
                  status: "Failed",
                  bug_info: {
                    severity: "P2",
                    error_log: "AssertionError: Invalid Zip Code Accepted",
                    ai_analysis: "The zip code validation regex is missing for International addresses."
                  },
                  script_content: `from selenium import webdriver

def test_address_val():
    driver = webdriver.Chrome()
    # Enter Zip: 00000 (Invalid)
    # BUG: It accepts it
    driver.find_element(By.ID, 'btn-next').click()
    assert 'Invalid Zip' in driver.page_source
    driver.quit()`
                },
                {
                  tc_id: "TC_038",
                  title: "Order Summary Verify",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_summary():
    # Verify items in final summary match cart
    pass`
                },
                {
                  tc_id: "TC_039",
                  title: "Email Confirmation Trigger",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_email_trigger():
    # Place Order
    # Check Mock Email Server for receipt
    pass`
                },
                {
                  tc_id: "TC_040",
                  title: "Stock Deduction",
                  status: "Failed",
                  bug_info: {
                    severity: "P1",
                    error_log: "AssertionError: Stock count did not decrease",
                    ai_analysis: "Race condition in Inventory Microservice prevents stock deduction during high load."
                  },
                  script_content: `from selenium import webdriver

def test_stock_deduct():
    # Get initial stock
    # Buy item
    # Get final stock
    # BUG: Initial == Final
    assert final_stock == initial_stock - 1
    driver.quit()`
                }
              ]
            }
          ]
        },
        {
          module_id: "MOD_05",
          module_name: "User Profile",
          features: [
            {
              feature_id: "FEAT_05_01",
              feature_name: "Profile Management",
              test_cases: [
                {
                  tc_id: "TC_041",
                  title: "Update Avatar",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_update_avatar():
    # Upload image
    # Assert new image src is loaded
    pass`
                },
                {
                  tc_id: "TC_042",
                  title: "Change Password",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_change_pass():
    # Enter old pass, new pass
    # Assert 'Password Updated'
    pass`
                },
                {
                  tc_id: "TC_043",
                  title: "Update Address",
                  status: "Failed",
                  bug_info: {
                    severity: "P3",
                    error_log: "StaleElementReferenceException",
                    ai_analysis: "The DOM refreshes twice upon saving address, causing the script to lose the reference to the success message."
                  },
                  script_content: `from selenium import webdriver

def test_update_addr():
    # Update address
    # Click Save
    # BUG: Script fails to read message
    msg = driver.find_element(By.ID, 'msg').text
    driver.quit()`
                },
                {
                  tc_id: "TC_044",
                  title: "Delete Account",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_delete_account():
    # Click Delete, Confirm
    # Assert Redirect to Homepage
    pass`
                },
                {
                  tc_id: "TC_045",
                  title: "Notification Settings",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_notif_settings():
    # Toggle Email Notifications Off
    # Reload page, verify still Off
    pass`
                }
              ]
            },
            {
              feature_id: "FEAT_05_02",
              feature_name: "Order History",
              test_cases: [
                {
                  tc_id: "TC_046",
                  title: "View Past Orders",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_view_orders():
    # Go to /orders
    # Assert list is not empty
    pass`
                },
                {
                  tc_id: "TC_047",
                  title: "Re-order Items",
                  status: "Failed",
                  bug_info: {
                    severity: "P2",
                    error_log: "404 Not Found",
                    ai_analysis: "The 'Buy Again' link points to a deprecated product URL structure."
                  },
                  script_content: `from selenium import webdriver

def test_reorder():
    driver = webdriver.Chrome()
    driver.get('https://staging.shop.com/orders')
    driver.find_element(By.LINK_TEXT, 'Buy Again').click()
    # BUG: 404 Page
    assert 'Product' in driver.title
    driver.quit()`
                },
                {
                  tc_id: "TC_048",
                  title: "Download Invoice PDF",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_download_invoice():
    # Click Download Invoice
    # Verify file exists in download dir
    pass`
                },
                {
                  tc_id: "TC_049",
                  title: "Filter Orders by Date",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_filter_orders():
    # Select 'Last 30 Days'
    # Verify dates in list
    pass`
                },
                {
                  tc_id: "TC_050",
                  title: "Track Shipment",
                  status: "Passed",
                  bug_info: null,
                  script_content: `from selenium import webdriver

def test_track_shipment():
    # Click Track
    # Assert Tracking Number is displayed
    pass`
                }
              ]
            }
          ]
        }
      ]
    },
    // Build 2 - Earlier build with different bugs
    {
      build_id: "B-4.5.1",
      build_date: "2025-12-15T10:00:00Z",
      total_modules: 5,
      total_features: 10,
      total_test_cases: 50,
      modules: [
        {
          module_id: "MOD_01",
          module_name: "Authentication",
          features: [
            {
              feature_id: "FEAT_01_01",
              feature_name: "User Login",
              test_cases: [
                { tc_id: "TC_001", title: "Valid Login", status: "Passed", bug_info: null, script_content: "# Valid login script" },
                { tc_id: "TC_002", title: "Invalid Password", status: "Passed", bug_info: null, script_content: "# Invalid password script" },
                { tc_id: "TC_003", title: "Empty Fields Validation", status: "Passed", bug_info: null, script_content: "# Empty fields script" },
                { tc_id: "TC_004", title: "SQL Injection Attempt", status: "Passed", bug_info: null, script_content: "# SQL injection script" },
                { tc_id: "TC_005", title: "Login with Locked Account", status: "Failed", bug_info: { severity: "P2", error_log: "AssertionError: Lock message not displayed", ai_analysis: "The account lock check happens after password validation, causing wrong error message." }, script_content: "# Locked account script" }
              ]
            },
            {
              feature_id: "FEAT_01_02",
              feature_name: "Sign Up / Registration",
              test_cases: [
                { tc_id: "TC_006", title: "Successful Registration", status: "Passed", bug_info: null, script_content: "# Registration script" },
                { tc_id: "TC_007", title: "Duplicate Email Check", status: "Failed", bug_info: { severity: "P1", error_log: "DuplicateEntryException", ai_analysis: "Same issue as B-4.5.2 - backend not handling duplicate emails properly." }, script_content: "# Duplicate email script" },
                { tc_id: "TC_008", title: "Weak Password Validation", status: "Passed", bug_info: null, script_content: "# Weak password script" },
                { tc_id: "TC_009", title: "Terms of Service Checkbox", status: "Failed", bug_info: { severity: "P3", error_log: "ElementNotFound: TOS checkbox missing", ai_analysis: "The TOS checkbox is not rendered on mobile viewport due to CSS media query issue." }, script_content: "# TOS script" },
                { tc_id: "TC_010", title: "Email Format Validation", status: "Passed", bug_info: null, script_content: "# Email format script" }
              ]
            }
          ]
        },
        {
          module_id: "MOD_02",
          module_name: "Product Catalog",
          features: [
            {
              feature_id: "FEAT_02_01",
              feature_name: "Search Functionality",
              test_cases: [
                { tc_id: "TC_011", title: "Search by Exact Name", status: "Passed", bug_info: null, script_content: "# Search exact script" },
                { tc_id: "TC_012", title: "Search No Results", status: "Passed", bug_info: null, script_content: "# Search empty script" },
                { tc_id: "TC_013", title: "Search Special Characters", status: "Failed", bug_info: { severity: "P2", error_log: "500 Internal Server Error", ai_analysis: "Same issue persists from previous build - special characters not sanitized." }, script_content: "# Search special script" },
                { tc_id: "TC_014", title: "Search Autosuggest", status: "Passed", bug_info: null, script_content: "# Autosuggest script" },
                { tc_id: "TC_015", title: "Search Case Insensitivity", status: "Passed", bug_info: null, script_content: "# Case insensitive script" }
              ]
            },
            {
              feature_id: "FEAT_02_02",
              feature_name: "Product Filters",
              test_cases: [
                { tc_id: "TC_016", title: "Filter by Price Range", status: "Failed", bug_info: { severity: "P1", error_log: "AssertionError: Price filter broken", ai_analysis: "Regression from B-4.5.0 - price filter query was overwritten." }, script_content: "# Price filter script" },
                { tc_id: "TC_017", title: "Filter by Category", status: "Passed", bug_info: null, script_content: "# Category filter script" },
                { tc_id: "TC_018", title: "Filter by Brand", status: "Failed", bug_info: { severity: "P2", error_log: "NoSuchElement: Brand dropdown missing", ai_analysis: "Brand dropdown component fails to load when there are more than 50 brands." }, script_content: "# Brand filter script" },
                { tc_id: "TC_019", title: "Clear All Filters", status: "Passed", bug_info: null, script_content: "# Clear filters script" },
                { tc_id: "TC_020", title: "Multiple Filters Combination", status: "Passed", bug_info: null, script_content: "# Multi filter script" }
              ]
            }
          ]
        },
        {
          module_id: "MOD_03",
          module_name: "Shopping Cart",
          features: [
            {
              feature_id: "FEAT_03_01",
              feature_name: "Cart Management",
              test_cases: [
                { tc_id: "TC_021", title: "Add Item to Cart", status: "Passed", bug_info: null, script_content: "# Add cart script" },
                { tc_id: "TC_022", title: "Remove Item from Cart", status: "Passed", bug_info: null, script_content: "# Remove cart script" },
                { tc_id: "TC_023", title: "Update Quantity", status: "Failed", bug_info: { severity: "P2", error_log: "AJAX timeout", ai_analysis: "Same AJAX issue - needs debouncing on quantity input." }, script_content: "# Update qty script" },
                { tc_id: "TC_024", title: "Add Out of Stock Item", status: "Passed", bug_info: null, script_content: "# OOS script" },
                { tc_id: "TC_025", title: "Cart Persistence (Cookie)", status: "Passed", bug_info: null, script_content: "# Cookie script" }
              ]
            },
            {
              feature_id: "FEAT_03_02",
              feature_name: "Price Calculation",
              test_cases: [
                { tc_id: "TC_026", title: "Subtotal Calculation", status: "Passed", bug_info: null, script_content: "# Subtotal script" },
                { tc_id: "TC_027", title: "Tax Calculation", status: "Passed", bug_info: null, script_content: "# Tax script" },
                { tc_id: "TC_028", title: "Shipping Cost Logic", status: "Passed", bug_info: null, script_content: "# Shipping script" },
                { tc_id: "TC_029", title: "Discount Code Application", status: "Passed", bug_info: null, script_content: "# Discount script" },
                { tc_id: "TC_030", title: "Total Grand Sum", status: "Passed", bug_info: null, script_content: "# Grand total script" }
              ]
            }
          ]
        },
        {
          module_id: "MOD_04",
          module_name: "Checkout & Payments",
          features: [
            {
              feature_id: "FEAT_04_01",
              feature_name: "Payment Gateway",
              test_cases: [
                { tc_id: "TC_031", title: "Credit Card Valid", status: "Passed", bug_info: null, script_content: "# CC valid script" },
                { tc_id: "TC_032", title: "Credit Card Declined", status: "Passed", bug_info: null, script_content: "# CC declined script" },
                { tc_id: "TC_033", title: "Payment Timeout Handling", status: "Failed", bug_info: { severity: "P1", error_log: "TimeoutException", ai_analysis: "Webhook callback issue - same as newer build." }, script_content: "# Timeout script" },
                { tc_id: "TC_034", title: "PayPal Integration", status: "Passed", bug_info: null, script_content: "# PayPal script" },
                { tc_id: "TC_035", title: "Currency Conversion", status: "Passed", bug_info: null, script_content: "# Currency script" }
              ]
            },
            {
              feature_id: "FEAT_04_02",
              feature_name: "Order Placement",
              test_cases: [
                { tc_id: "TC_036", title: "Guest Checkout", status: "Passed", bug_info: null, script_content: "# Guest checkout script" },
                { tc_id: "TC_037", title: "Shipping Address Validation", status: "Passed", bug_info: null, script_content: "# Address validation script" },
                { tc_id: "TC_038", title: "Order Summary Verify", status: "Passed", bug_info: null, script_content: "# Order summary script" },
                { tc_id: "TC_039", title: "Email Confirmation Trigger", status: "Passed", bug_info: null, script_content: "# Email trigger script" },
                { tc_id: "TC_040", title: "Stock Deduction", status: "Passed", bug_info: null, script_content: "# Stock deduction script" }
              ]
            }
          ]
        },
        {
          module_id: "MOD_05",
          module_name: "User Profile",
          features: [
            {
              feature_id: "FEAT_05_01",
              feature_name: "Profile Management",
              test_cases: [
                { tc_id: "TC_041", title: "Update Avatar", status: "Passed", bug_info: null, script_content: "# Avatar script" },
                { tc_id: "TC_042", title: "Change Password", status: "Passed", bug_info: null, script_content: "# Password script" },
                { tc_id: "TC_043", title: "Update Address", status: "Passed", bug_info: null, script_content: "# Address script" },
                { tc_id: "TC_044", title: "Delete Account", status: "Passed", bug_info: null, script_content: "# Delete account script" },
                { tc_id: "TC_045", title: "Notification Settings", status: "Passed", bug_info: null, script_content: "# Notification script" }
              ]
            },
            {
              feature_id: "FEAT_05_02",
              feature_name: "Order History",
              test_cases: [
                { tc_id: "TC_046", title: "View Past Orders", status: "Passed", bug_info: null, script_content: "# View orders script" },
                { tc_id: "TC_047", title: "Re-order Items", status: "Passed", bug_info: null, script_content: "# Reorder script" },
                { tc_id: "TC_048", title: "Download Invoice PDF", status: "Passed", bug_info: null, script_content: "# Invoice script" },
                { tc_id: "TC_049", title: "Filter Orders by Date", status: "Passed", bug_info: null, script_content: "# Filter orders script" },
                { tc_id: "TC_050", title: "Track Shipment", status: "Passed", bug_info: null, script_content: "# Track shipment script" }
              ]
            }
          ]
        }
      ]
    },
    // Build 3 - Oldest in consideration window
    {
      build_id: "B-4.5.0",
      build_date: "2025-12-10T08:00:00Z",
      total_modules: 5,
      total_features: 10,
      total_test_cases: 50,
      modules: [
        {
          module_id: "MOD_01",
          module_name: "Authentication",
          features: [
            {
              feature_id: "FEAT_01_01",
              feature_name: "User Login",
              test_cases: [
                { tc_id: "TC_001", title: "Valid Login", status: "Passed", bug_info: null, script_content: "# Valid login" },
                { tc_id: "TC_002", title: "Invalid Password", status: "Failed", bug_info: { severity: "P3", error_log: "Timing issue", ai_analysis: "Password error message appears after 5s delay." }, script_content: "# Invalid pass" },
                { tc_id: "TC_003", title: "Empty Fields Validation", status: "Passed", bug_info: null, script_content: "# Empty fields" },
                { tc_id: "TC_004", title: "SQL Injection Attempt", status: "Passed", bug_info: null, script_content: "# SQL injection" },
                { tc_id: "TC_005", title: "Login with Locked Account", status: "Passed", bug_info: null, script_content: "# Locked account" }
              ]
            },
            {
              feature_id: "FEAT_01_02",
              feature_name: "Sign Up / Registration",
              test_cases: [
                { tc_id: "TC_006", title: "Successful Registration", status: "Passed", bug_info: null, script_content: "# Registration" },
                { tc_id: "TC_007", title: "Duplicate Email Check", status: "Passed", bug_info: null, script_content: "# Duplicate email" },
                { tc_id: "TC_008", title: "Weak Password Validation", status: "Passed", bug_info: null, script_content: "# Weak password" },
                { tc_id: "TC_009", title: "Terms of Service Checkbox", status: "Passed", bug_info: null, script_content: "# TOS" },
                { tc_id: "TC_010", title: "Email Format Validation", status: "Failed", bug_info: { severity: "P3", error_log: "Regex issue", ai_analysis: "Same regex issue that reappears in B-4.5.2." }, script_content: "# Email format" }
              ]
            }
          ]
        },
        {
          module_id: "MOD_02",
          module_name: "Product Catalog",
          features: [
            {
              feature_id: "FEAT_02_01",
              feature_name: "Search Functionality",
              test_cases: [
                { tc_id: "TC_011", title: "Search by Exact Name", status: "Passed", bug_info: null, script_content: "# Search exact" },
                { tc_id: "TC_012", title: "Search No Results", status: "Passed", bug_info: null, script_content: "# Search empty" },
                { tc_id: "TC_013", title: "Search Special Characters", status: "Passed", bug_info: null, script_content: "# Search special" },
                { tc_id: "TC_014", title: "Search Autosuggest", status: "Failed", bug_info: { severity: "P2", error_log: "Autosuggest timeout", ai_analysis: "Autosuggest API has high latency causing timeouts." }, script_content: "# Autosuggest" },
                { tc_id: "TC_015", title: "Search Case Insensitivity", status: "Passed", bug_info: null, script_content: "# Case insensitive" }
              ]
            },
            {
              feature_id: "FEAT_02_02",
              feature_name: "Product Filters",
              test_cases: [
                { tc_id: "TC_016", title: "Filter by Price Range", status: "Passed", bug_info: null, script_content: "# Price filter" },
                { tc_id: "TC_017", title: "Filter by Category", status: "Passed", bug_info: null, script_content: "# Category filter" },
                { tc_id: "TC_018", title: "Filter by Brand", status: "Passed", bug_info: null, script_content: "# Brand filter" },
                { tc_id: "TC_019", title: "Clear All Filters", status: "Passed", bug_info: null, script_content: "# Clear filters" },
                { tc_id: "TC_020", title: "Multiple Filters Combination", status: "Passed", bug_info: null, script_content: "# Multi filter" }
              ]
            }
          ]
        },
        {
          module_id: "MOD_03",
          module_name: "Shopping Cart",
          features: [
            {
              feature_id: "FEAT_03_01",
              feature_name: "Cart Management",
              test_cases: [
                { tc_id: "TC_021", title: "Add Item to Cart", status: "Passed", bug_info: null, script_content: "# Add cart" },
                { tc_id: "TC_022", title: "Remove Item from Cart", status: "Passed", bug_info: null, script_content: "# Remove cart" },
                { tc_id: "TC_023", title: "Update Quantity", status: "Passed", bug_info: null, script_content: "# Update qty" },
                { tc_id: "TC_024", title: "Add Out of Stock Item", status: "Passed", bug_info: null, script_content: "# OOS" },
                { tc_id: "TC_025", title: "Cart Persistence (Cookie)", status: "Passed", bug_info: null, script_content: "# Cookie" }
              ]
            },
            {
              feature_id: "FEAT_03_02",
              feature_name: "Price Calculation",
              test_cases: [
                { tc_id: "TC_026", title: "Subtotal Calculation", status: "Passed", bug_info: null, script_content: "# Subtotal" },
                { tc_id: "TC_027", title: "Tax Calculation", status: "Passed", bug_info: null, script_content: "# Tax" },
                { tc_id: "TC_028", title: "Shipping Cost Logic", status: "Failed", bug_info: { severity: "P1", error_log: "Free shipping not applied", ai_analysis: "Threshold check uses wrong operator (> instead of >=)." }, script_content: "# Shipping" },
                { tc_id: "TC_029", title: "Discount Code Application", status: "Passed", bug_info: null, script_content: "# Discount" },
                { tc_id: "TC_030", title: "Total Grand Sum", status: "Passed", bug_info: null, script_content: "# Grand total" }
              ]
            }
          ]
        },
        {
          module_id: "MOD_04",
          module_name: "Checkout & Payments",
          features: [
            {
              feature_id: "FEAT_04_01",
              feature_name: "Payment Gateway",
              test_cases: [
                { tc_id: "TC_031", title: "Credit Card Valid", status: "Passed", bug_info: null, script_content: "# CC valid" },
                { tc_id: "TC_032", title: "Credit Card Declined", status: "Passed", bug_info: null, script_content: "# CC declined" },
                { tc_id: "TC_033", title: "Payment Timeout Handling", status: "Passed", bug_info: null, script_content: "# Timeout" },
                { tc_id: "TC_034", title: "PayPal Integration", status: "Passed", bug_info: null, script_content: "# PayPal" },
                { tc_id: "TC_035", title: "Currency Conversion", status: "Passed", bug_info: null, script_content: "# Currency" }
              ]
            },
            {
              feature_id: "FEAT_04_02",
              feature_name: "Order Placement",
              test_cases: [
                { tc_id: "TC_036", title: "Guest Checkout", status: "Passed", bug_info: null, script_content: "# Guest checkout" },
                { tc_id: "TC_037", title: "Shipping Address Validation", status: "Passed", bug_info: null, script_content: "# Address" },
                { tc_id: "TC_038", title: "Order Summary Verify", status: "Passed", bug_info: null, script_content: "# Summary" },
                { tc_id: "TC_039", title: "Email Confirmation Trigger", status: "Passed", bug_info: null, script_content: "# Email" },
                { tc_id: "TC_040", title: "Stock Deduction", status: "Passed", bug_info: null, script_content: "# Stock" }
              ]
            }
          ]
        },
        {
          module_id: "MOD_05",
          module_name: "User Profile",
          features: [
            {
              feature_id: "FEAT_05_01",
              feature_name: "Profile Management",
              test_cases: [
                { tc_id: "TC_041", title: "Update Avatar", status: "Passed", bug_info: null, script_content: "# Avatar" },
                { tc_id: "TC_042", title: "Change Password", status: "Passed", bug_info: null, script_content: "# Password" },
                { tc_id: "TC_043", title: "Update Address", status: "Passed", bug_info: null, script_content: "# Address" },
                { tc_id: "TC_044", title: "Delete Account", status: "Passed", bug_info: null, script_content: "# Delete" },
                { tc_id: "TC_045", title: "Notification Settings", status: "Passed", bug_info: null, script_content: "# Notification" }
              ]
            },
            {
              feature_id: "FEAT_05_02",
              feature_name: "Order History",
              test_cases: [
                { tc_id: "TC_046", title: "View Past Orders", status: "Passed", bug_info: null, script_content: "# View orders" },
                { tc_id: "TC_047", title: "Re-order Items", status: "Passed", bug_info: null, script_content: "# Reorder" },
                { tc_id: "TC_048", title: "Download Invoice PDF", status: "Passed", bug_info: null, script_content: "# Invoice" },
                { tc_id: "TC_049", title: "Filter Orders by Date", status: "Passed", bug_info: null, script_content: "# Filter" },
                { tc_id: "TC_050", title: "Track Shipment", status: "Passed", bug_info: null, script_content: "# Track" }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Historical bugs from all builds (for Historical Bugs Vault)
export interface HistoricalBug {
  bug_id: string;
  title: string;
  feature_id: string;
  feature_name: string;
  module_name: string;
  severity: "P1" | "P2" | "P3";
  status: "open" | "in-progress" | "resolved";
  build_id: string;
  created_at: string;
  assignee: string;
  description: string;
  error_log: string;
  ai_analysis: string;
  tc_id: string;
}

// Extract all bugs from database for historical view
export function extractAllBugs(): HistoricalBug[] {
  const bugs: HistoricalBug[] = [];
  let bugCounter = 1;
  
  qaDatabase.builds.forEach(build => {
    build.modules.forEach(module => {
      module.features.forEach(feature => {
        feature.test_cases.forEach(tc => {
          if (tc.bug_info) {
            bugs.push({
              bug_id: `BUG-2025-${String(bugCounter++).padStart(3, '0')}`,
              title: `${tc.title} - ${tc.bug_info.error_log.substring(0, 40)}...`,
              feature_id: feature.feature_id,
              feature_name: feature.feature_name,
              module_name: module.module_name,
              severity: tc.bug_info.severity,
              status: build.build_id === "B-4.5.2" ? "open" : build.build_id === "B-4.5.1" ? "in-progress" : "resolved",
              build_id: build.build_id,
              created_at: build.build_date,
              assignee: getAssignee(module.module_name),
              description: tc.bug_info.ai_analysis,
              error_log: tc.bug_info.error_log,
              ai_analysis: tc.bug_info.ai_analysis,
              tc_id: tc.tc_id
            });
          }
        });
      });
    });
  });
  
  return bugs;
}

function getAssignee(moduleName: string): string {
  const assignees: Record<string, string> = {
    "Authentication": "Sarah Chen",
    "Product Catalog": "Mike Johnson",
    "Shopping Cart": "Emily Davis",
    "Checkout & Payments": "John Smith",
    "User Profile": "Lisa Wang"
  };
  return assignees[moduleName] || "Unassigned";
}

// Export computed data
export const historicalBugs = extractAllBugs();
