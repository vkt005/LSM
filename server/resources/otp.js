module.exports = otpEmail = (otp) => `<html>
<style>
 
  @media screen {
    /* latin */
    @font-face {
      font-family: 'Lato';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: local('Lato Italic'), local('Lato-Italic'),
        url(https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-qNiXg7Q.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
        U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    /* latin */
    @font-face {
      font-family: 'Lato';
      font-style: italic;
      font-weight: 900;
      font-display: swap;
      src: local('Lato Black Italic'), local('Lato-BlackItalic'),
        url(https://fonts.gstatic.com/s/lato/v16/S6u_w4BMUTPHjxsI3wi_Gwftx9897g.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
        U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    /* latin */
    @font-face {
      font-family: 'Lato';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Lato Regular'), local('Lato-Regular'),
        url(https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wXiWtFCc.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
        U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    /* latin */
    @font-face {
      font-family: 'Lato';
      font-style: normal;
      font-weight: 900;
      font-display: swap;
      src: local('Lato Black'), local('Lato-Black'),
        url(https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh50XSwiPGQ3q5d0.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
        U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* latin */
    @font-face {
      font-family: 'Lora';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/lora/v16/0QI6MX1D_JOuGQbT0gvTJPa787wsuxJBkqt8ndeYxZ0.woff) format('woff');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
        U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    /* latin */
    @font-face {
      font-family: 'Lora';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/lora/v16/0QIhMX1D_JOuMw_LIftLtfOm8w.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
        U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    /* latin */
    @font-face {
      font-family: 'Lora';
      font-style: italic;
      font-weight: 500;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/lora/v16/0QIhMX1D_JOuMw_LIftLtfOm8w.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
        U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
  }

  html,
  body {
    margin: 0 auto !important;
    padding: 0 !important;
    height: 100% !important;
    width: 100% !important;
    font-family: 'Lato', 'Lucida Grande', 'Lucida Sans Unicode', Tahoma, Sans-Serif;
  } 

  table,
  td {
    font-family: 'Lato', 'Lucida Grande', 'Lucida Sans Unicode', Tahoma, Sans-Serif;
    font-size: 14px;
    line-height: 1.6;
  }

  table {
    border-spacing: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    margin: 0 auto !important;
  }

  a:hover {
    opacity: 0.7;
  }

  a {
    text-decoration: none;
  }

</style>

<center lang="en" style="width: 100%; background-color: rgb(244, 247, 249)">
  <div style="max-width: 620px; margin: 0 auto; padding: 50px 0;" class="email-container">
    <table align="center" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto">
      <tbody>
        <tr style="background-color: rgb(255, 255, 255)">
          <td style="padding: 0 20px">
            <table style="margin: 0 !important; width: 100%">
              <tbody>
                <tr>
                  <td style="padding: 20px 0; text-align: left; border-bottom: 1px solid #dddddd">
                    <a href="https://www.universityliving.com">
                      <img src="https://cdn.universityliving.com/logo/logo.png" height="50" border="0" />
                    </a>
                  </td>
                  <td
                    style="
                      font-style: normal;
                      padding: 20px 0;
                      text-align: right;
                      font-size: 18px;
                      font-family: 'Lora', serif;
                      color: #f56a54;
                      font-style: italic;
                      border-bottom: 1px solid #dddddd;
                    "
                  >
                    Home for every student
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

     

        <tr style="background-color: rgb(255, 255, 255)">
          <td style="text-align: center;padding: 20px;">
            <p style="font-weight: 900; font-size: 20px; color: #5e5e5e;text-align: center;margin-top:0;margin-bottom:0">
              🔑 We have received a request to reset the password for your account. You can reset your password with the help of the OTP given below (Valid only for the next 5 minutes).
            </p>
           
         
          </td>
        </tr>

        <tr>
          <td style="background-color: rgb(255, 255, 255)">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <tbody>
                <tr>
                  <td style="font-size: 16px; padding: 20px;  color: #8e8e8e; text-align: left;padding-bottom: 50px;">
               
                    <p style="text-align: center;">
                      <span  style="display:inline-block;text-align:center;color:#555;border: 2px dashed grey;padding: 10px;letter-spacing: 10px; font-size: 22px; font-weight: bold;padding-left:20px">${otp}</span>
                      
                   </p>

                    <br /><br /><br />
              Thanks <br />
              <strong>Team University Living</strong>
             
              <br />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

         <tr style="background-color: #fff">
        <td style="padding: 0 0">
          <img src="https://cdn.universityliving.com/emailer/bottomEmail.png" border="0"
            style="width: 100%; max-width: 620px; height: auto;display: block;background:white">
        </td>
      </tr>

        <tr style="background-color: #fbfbfb">
          <td style="padding: 0 20px">
            <table style="margin: 0 !important; width: 100%">
              <tbody>
                <tr>
                  <td style="padding: 20px 0; text-align: left; border-bottom: 1px solid #dddddd">
                    <a href="https://www.universityliving.com">
                      <img src="https://cdn.universityliving.com/logo/logo.png" height="50" alt="logo" border="0" />
                    </a>
                  </td>

                  <td style="text-align: right; border-bottom: 1px solid #dddddd">
                    <p style="margin-top: 0; color: rgb(58, 55, 97); font-size: 14px; font-style: italic; margin-bottom: 4px">
                      follow us on
                    </p>

                    <p class="social" style="margin-top: 0">
                      <a href="https://www.instagram.com/uni.living/"
                        ><img
                          src="https://cdn.universityliving.com/icons/instagram-circel-colored.png"
                          alt="instagram"
                          width="10%"
                          style="margin-right: 5px"
                      /></a>
                      <a href="https://www.linkedin.com/school/university-living/"
                        ><img
                          src="https://cdn.universityliving.com/icons/linkedin-circel-colored.png"
                          alt="linkedin"
                          width="10%"
                          style="margin-right: 5px"
                      /></a>
                      <a href="https://www.facebook.com/universityliving/"
                        ><img
                          src="https://cdn.universityliving.com/icons/facebook-circel-colored.png"
                          alt="facebook"
                          width="10%"
                          style="margin-right: 5px"
                      /></a>
                      <a href="https://twitter.com/living_uni"
                        ><img
                          src="https://cdn.universityliving.com/icons/twitter-circel-colored.png"
                          alt="twitter"
                          width="10%"
                          style="margin-right: 0"
                      /></a>
                    </p>
                  </td>
                </tr>

               

                  <tr>
                  <td colspan="2" style="line-height: 2.5; padding: 10px 0; color: #929292;text-align: center;font-size:12px;">
                    Sent with ❤️ from  University Living <br />
                    <ul style="width: 100%;list-style: none;overflow: hidden;margin:0 auto;text-align: center;">
                      <li style="float: left;padding-right: 5px;margin-left:0"><a href="tel:+44-2045099650" style="text-decoration: none; color:#646262;">🇬🇧 +44 2045099650 </a> |</li>
                      <li style="float: left;padding-right: 5px;margin-left:0"><a href="tel:+91-8287902210" style="text-decoration: none; color:#646262;">🇮🇳 +91 8287902210</a> |</li>
                      <li style="float: left;padding-right: 5px;margin-left:0"><a href="tel:+61-386090060" style="text-decoration: none; color:#646262;">🇦🇺 +61 386090060</a> | </li>
                      <li style="float: left;padding-right: 5px;margin-left:0"><a href="https://api.whatsapp.com/send?phone=442086380820&text=Hi" style="text-decoration: none; color:#646262;"><img width="12px" src="https://cdn.universityliving.com/icons/whatsapp.png" alt=""> +44 2086380820</a></li>
                    </ul>
                    © 2021 University Living Accommodations Pvt Ltd. | <a href="https://www.universityliving.com/terms-and-privacy" style="text-decoration: none; color:#929292;">Terms & Privacy</a> 
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <tr>
          <td height="20" style="font-size: 0px; line-height: 0px">&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div>
</center>
</html>`;