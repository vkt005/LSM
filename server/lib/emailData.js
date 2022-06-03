exports.sendEmailToUserLeadInsert = (lead) => {
  return `
    <html>
      <style>
        @media screen {
          /* latin */
          @font-face {
            font-family: "Lato";
            font-style: italic;
            font-weight: 400;
            font-display: swap;
            src: local("Lato Italic"), local("Lato-Italic"),
              url(https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-qNiXg7Q.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
    
          /* latin */
          @font-face {
            font-family: "Lato";
            font-style: italic;
            font-weight: 900;
            font-display: swap;
            src: local("Lato Black Italic"), local("Lato-BlackItalic"),
              url(https://fonts.gstatic.com/s/lato/v16/S6u_w4BMUTPHjxsI3wi_Gwftx9897g.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
    
          /* latin */
          @font-face {
            font-family: "Lato";
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: local("Lato Regular"), local("Lato-Regular"),
              url(https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wXiWtFCc.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
    
          /* latin */
          @font-face {
            font-family: "Lato";
            font-style: normal;
            font-weight: 900;
            font-display: swap;
            src: local("Lato Black"), local("Lato-Black"),
              url(https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh50XSwiPGQ3q5d0.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
    
          /* latin */
          @font-face {
            font-family: "Lora";
            font-style: normal;
            font-weight: 500;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/lora/v16/0QI6MX1D_JOuGQbT0gvTJPa787wsuxJBkqt8ndeYxZ0.woff)
              format("woff");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
    
          /* latin */
          @font-face {
            font-family: "Lora";
            font-style: italic;
            font-weight: 400;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/lora/v16/0QIhMX1D_JOuMw_LIftLtfOm8w.woff2)
              format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
    
          /* latin */
          @font-face {
            font-family: "Lora";
            font-style: italic;
            font-weight: 500;
            font-display: swap;
            src: url(https://fonts.gstatic.com/s/lora/v16/0QIhMX1D_JOuMw_LIftLtfOm8w.woff2)
              format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
              U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
              U+2212, U+2215, U+FEFF, U+FFFD;
          }
        }
    
        html,
        body {
          margin: 0 auto !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          font-family: "Lato", "Lucida Grande", "Lucida Sans Unicode", Tahoma,
            Sans-Serif;
        }
    
        table,
        td {
          font-family: "Lato", "Lucida Grande", "Lucida Sans Unicode", Tahoma,
            Sans-Serif;
          font-size: 14px;
          line-height: 1.6;
        }
    
        table {
          border-spacing: 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 0 auto !important;
        }
    
        /* a:hover {
            opacity: 0.7;
        } */
    
        a {
          text-decoration: none;
        }
      </style>
    
      <center lang="en" style="width: 100%; background-color: rgb(244, 247, 249)">
        <div
          style="max-width: 620px; margin: 0 auto; padding: 50px 0"
          class="email-container"
        >
          <table
            align="center"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="100%"
            style="margin: auto"
          >
            <tbody>
              <tr style="background-color: rgb(255, 255, 255)">
                <td style="text-align: left; padding: 0px 0 20px 0">
                  <img
                    src="https://cdn.universityliving.com/emailer/thankyou_23Dec_image.jpg"
                    style="width: 100%"
                  />
                </td>
              </tr>
    
              <tr style="background-color: rgb(255, 255, 255)">
                <td style="text-align: left; padding: 30px 40px 5px 35px">
                  <p style="color: #464646; font-size: 25px; font-weight: bold">
                    Yay! We're Going to Find You the Perfect Room!
                  </p>
                </td>
              </tr>
    
              <tr style="background-color: rgb(255, 255, 255)">
                <td style="text-align: left; padding: 10px 40px 10px 40px">
                  <p style="color: #707070; font-size: 15px">
                    Hi ${lead.firstName},<br />
                    <br />
                    Thanks for sharing your preferences, we can definitely help you
                    find an accommodation that crosses all the ‘t’s and dots all the
                    ‘i’s of your expectations. So, take a breather, relax and don’t
                    sweat it! <br />
                    <br />
                    We're excited to find you 'your kind of room'! Our accommodation
                    expert will get in touch with you shortly with some superb
                    options curated just for you. <br /> <br />
                    In the meantime, you can join our Student Community to find answers to all your
                     queries regarding studying abroad, university life, visa processes, student life abroad,
                      universities, accommodation, and much more.
                  </p>
                </td>
              </tr>
    
          
    
              <tr style="background-color: rgb(255, 255, 255)">
                <td
                  style="
                    text-align: left;
                    padding: 20px 0 0px 0;
                    margin-bottom: 30px;
                  "
                >
                  <img
                    src="https://cdn.universityliving.com/images/squad_13sept.png"
                    style="width: 100%"
                  />
                </td>
              </tr>
    
              <tr style="background-color: rgb(255, 255, 255)">
              
                <td
                  style="
                    text-align: center;
                    padding: 0px 0px 0px 0px;
                    background-color: #3c3c71;
                  "
                >
                  <p
                    style="
                      color: #ffffff;
                      font-size: 21px;
                      font-weight: bold;
                      padding: 15px 0;
                    "
                  >
                    UniLiv - Community for International Students
                  </p>
                </a>
                </td>
              </tr>
    
              <tr style="background-color: rgb(255, 255, 255)">
                <td
                  style="
                    text-align: center;
                    padding: 0px 0px 0px 0px;
                    background-color: #e75242;
                  "
                >
                  <a
                    href="https://www.facebook.com/groups/unilivcommunityforinternationalstudents"
                    target="_blank"
                  >
                    <p
                      style="
                        color: #ffffff;
                        font-size: 21px;
                        font-weight: bold;
                        padding: 16px 0;
                      "
                    >
                      JOIN NOW
                    </p>
                  </a>
                </td>
              </tr>
    
              <tr style="background-color: rgb(255, 255, 255)">
                <td style="padding: 17px 30px 0px 30px">
                  <p
                    style="
                      font-size: 40px;
                      font-weight: bold;
                      color: #3c3c71;
                      border-top: 1px solid #707070;
                      padding: 30px 0 0 0;
                    "
                  >
                    More For You
                  </p>
                </td>
              </tr>
    
              <tr style="background-color: rgb(255, 255, 255); display: flex">
                <td style="padding: 0px 60px 0px 30px">
                  <a
                    href="https://www.youtube.com/watch?v=4UOvCML7JL0&list=PLim-2dhfhZWsPtd3MYDitvzD8H4K80mUg"
                    target="_blank"
                  >
                    <p
                      style="
                        color: #ffffff;
                        font-size: 18px;
                        font-weight: bold;
                        background-color: #064c7c;
                        border-radius: 7px;
                        padding: 17px 15px;
                        width: 190px;
                        display: flex;
                        justify-content: space-between;
                      "
                    >
                      Video Reviews
                      <img
                        src="https://cdn.universityliving.com/emailer/vedio_16sept2021.png"
                        style="margin-top: -1px; margin-left: 9px; height: 30px"
                      />
                    </p>
                  </a>
                </td>
                <td style="padding: 0px 0px 0px 30px">
                  <a
                    href="https://www.universityliving.com/services"
                    target="_blank"
                  >
                    <p
                      style="
                        color: #ffffff;
                        font-size: 18px;
                        font-weight: bold;
                        background-color: #111a41;
                        border-radius: 7px;
                        padding: 17px 15px;
                        width: 190px;
                        display: flex;
                        justify-content: space-between;
                      "
                    >
                      Our Services
                      <img
                        src="https://cdn.universityliving.com/emailer/services_16sept2021.png"
                        style="margin-top: -1px; margin-left: 9px; height: 30px"
                      />
                    </p>
                  </a>
                </td>
              </tr>
    
              <tr style="background-color: rgb(255, 255, 255); display: flex">
                <td style="padding: 0px 60px 0px 30px">
                  <a href=" https://www.universityliving.com/faq" target="_blank">
                    <p
                      style="
                        color: #ffffff;
                        font-size: 18px;
                        font-weight: bold;
                        background-color: #66728a;
                        border-radius: 7px;
                        padding: 17px 15px;
                        width: 190px;
                        display: flex;
                        justify-content: space-between;
                        margin: 5px 0 0 0;
                      "
                    >
                      FAQs
                      <img
                        src="https://cdn.universityliving.com/emailer/faq_16sept2021.png"
                        style="margin-top: -1px; margin-left: 9px; height: 30px"
                      />
                    </p>
                  </a>
                </td>
                <td style="padding: 0px 0px 0px 30px">
                  <a
                    href="https://www.universityliving.com/refer-and-earn"
                    target="_blank"
                  >
                    <p
                      style="
                        color: #ffffff;
                        font-size: 18px;
                        font-weight: bold;
                        background-color: #e75242;
                        border-radius: 7px;
                        padding: 17px 15px;
                        width: 190px;
                        display: flex;
                        justify-content: space-between;
                        margin: 5px 0 0 0;
                      "
                    >
                      Refer & Earn
                      <img
                        src="https://cdn.universityliving.com/emailer/referearn_16sept2021.png"
                        style="margin-top: -1px; margin-left: 9px; height: 30px"
                      />
                    </p>
                  </a>
                </td>
              </tr>
    
              <tr style="background-color: rgb(255, 255, 255)">
                <td
                  style="
                    text-align: left;
                    padding: 60px 30px 20px 30px;
                    display: flex;
                  "
                >
                  <a
                    href="https://www.trustpilot.com/review/universityliving.com"
                    target="_blank"
                  >
                    <img
                      src="https://cdn.universityliving.com/emailer/trustpilot_6sept_2021.png"
                      style="width: 128px; height: 33px; margin-top: -1px"
                      ;
                    />
                  </a>
                  <a
                    href="https://www.universityliving.com/reviews-and-press-release"
                    target="_blank"
                  >
                    <img
                      src="https://cdn.universityliving.com/emailer/star_6sept2021.png"
                      style="
                        width: 118px;
                        height: 22px;
                        margin-left: 15px;
                        margin-top: 9px;
                      "
                      ;
                    />
                  </a>
                  <p
                    style="
                      font-size: 18px;
                      color: #292563;
                      margin-top: 6px;
                      margin-left: 10px;
                    "
                  >
                    4.9 • Reviews 2691 • Excellent
                  </p>
                </td>
              </tr>
    
              <tr style="background-color: rgb(255, 255, 255); display: flex">
                <td style="padding: 0 8px 20px 30px">
                  <img
                    style="margin-bottom: -15px; margin-left: 218px; width: 31px"
                    src="https://cdn.universityliving.com/emailer/comma_6sep_2021.png"
                  />
                  <p
                    style="
                      width: 223px;
                      color: #010101;
                      font-size: 15px;
                      background-color: #f5f6f8;
                      padding: 20px;
                      text-align: left;
                      border-radius: 10px 10px 0 0;
                      margin: 0;
                      height: 191px;
                    "
                  >
                    <strong> Very helpful and quick services</strong> <br /><br />
                    Very helpful and quick services. Great customer service and
                    polite staff, very fast and efficient. Great experience. Fast
                    service and really helpful
                  </p>
                  <p
                    style="
                      background-color: #0a1c5d;
                      box-shadow: 0px 3px 6px #00000029;
                      color: white;
                      font-size: 16px;
                      font-weight: bold;
                      opacity: 0.68;
                      padding: 5px 10px;
                      width: 244px;
                      text-align: left;
                      margin: 0;
                    "
                  >
                    Ursula Garcia
                    <img
                      src="https://cdn.universityliving.com/emailer/home_icons_6sep2021.png"
                      style="margin-top: -21px; margin-left: 159px"
                    />
                  </p>
                </td>
                <td>
                  <img
                    style="margin-bottom: -15px; margin-left: 218px; width: 31px"
                    src="https://cdn.universityliving.com/emailer/comma_6sep_2021.png"
                  />
                  <p
                    style="
                      width: 223px;
                      color: #010101;
                      font-size: 15px;
                      background-color: #f5f6f8;
                      padding: 20px;
                      text-align: left;
                      border-radius: 10px 10px 0 0;
                      margin: 0 0 0 27px;
                    "
                  >
                    <strong>Great service</strong> <br /><br />
                    I am very thankful to University living. The service is super
                    fast and easy. Always ready to help you no matter what. I feel
                    they are they are perfectionist. Thank you...
                  </p>
                  <p
                    style="
                      background-color: #0a1c5d;
                      box-shadow: 0px 3px 6px #00000029;
                      color: white;
                      font-size: 16px;
                      font-weight: bold;
                      opacity: 0.68;
                      padding: 5px 10px;
                      width: 244px;
                      text-align: left;
                      margin: 0 0 0 27px;
                    "
                  >
                    Diksha Balmiki
                    <img
                      src="https://cdn.universityliving.com/emailer/home_icons_6sep2021.png"
                      style="margin-top: -21px; margin-left: 159px"
                    />
                  </p>
                </td>
              </tr>
    
              <tr style="background-color: #fff">
                <td style="padding: 0 0">
                  <img
                    src="https://cdn.universityliving.com/emailer/bottomEmail.png"
                    border="0"
                    style="
                      width: 100%;
                      max-width: 620px;
                      height: auto;
                      display: block;
                      background: white;
                    "
                  />
                </td>
              </tr>
    
              <tr style="background-color: #fbfbfb">
                <td style="padding: 0 20px">
                  <table style="margin: 0 !important; width: 100%">
                    <tbody>
                      <tr>
                        <td
                          style="
                            padding: 20px 0;
                            text-align: left;
                            border-bottom: 1px solid #dddddd;
                          "
                        >
                          <a href="https://www.universityliving.com">
                            <img
                              src="https://cdn.universityliving.com/logo/logo.png"
                              height="50"
                              alt="logo"
                              border="0"
                            />
                          </a>
                        </td>
    
                        <td
                          style="
                            text-align: right;
                            border-bottom: 1px solid #dddddd;
                          "
                        >
                          <p
                            style="
                              margin-top: 0;
                              color: rgb(58, 55, 97);
                              font-size: 14px;
                              font-style: italic;
                              margin-bottom: 4px;
                            "
                          >
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
                            <a
                              href="https://www.linkedin.com/school/university-living/"
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
                        <td
                          colspan="2"
                          style="
                            line-height: 2.5;
                            padding: 10px 0;
                            color: #929292;
                            text-align: center;
                            font-size: 12px;
                          "
                        >
                          Sent with ❤️ from University Living <br />
                          <ul
                            style="
                              width: 100%;
                              list-style: none;
                              overflow: hidden;
                              margin: 0 auto;
                              text-align: center;
                            "
                          >
                            <li
                              style="
                                float: left;
                                padding-right: 5px;
                                margin-left: 0;
                              "
                            >
                              <a
                                href="tel:+44-2045099650"
                                style="text-decoration: none; color: #646262"
                                >🇬🇧 +44 2045099650
                              </a>
                              |
                            </li>
                            <li
                              style="
                                float: left;
                                padding-right: 5px;
                                margin-left: 0;
                              "
                            >
                              <a
                                href="tel:+91-8287902210"
                                style="text-decoration: none; color: #646262"
                                >🇮🇳 +91 8287902210</a
                              >
                              |
                            </li>
                            <li
                              style="
                                float: left;
                                padding-right: 5px;
                                margin-left: 0;
                              "
                            >
                              <a
                                href="tel:+61-386090060"
                                style="text-decoration: none; color: #646262"
                                >🇦🇺 +61 386090060</a
                              >
                              |
                            </li>
                            <li
                              style="
                                float: left;
                                padding-right: 5px;
                                margin-left: 0;
                              "
                            >
                              <a
                                href="https://api.whatsapp.com/send?phone=442086380820&text=Hi"
                                style="text-decoration: none; color: #646262"
                                ><img
                                  width="12px"
                                  src="https://cdn.universityliving.com/icons/whatsapp.png"
                                  alt=""
                                />
                                +44 2086380820</a
                              >
                            </li>
                          </ul>
                          © 2021 University Living Accommodations Pvt Ltd. |
                          <a
                            href="https://www.universityliving.com/terms-and-privacy"
                            style="text-decoration: none; color: #929292"
                            >Terms & Privacy</a
                          >
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
};


exports.resetPasswordEmail = (email,password) => {
  return `<html>
  <style>
    @media screen {
      /* latin */
      @font-face {
        font-family: "Lato";
        font-style: italic;
        font-weight: 400;
        font-display: swap;
        src: local("Lato Italic"), local("Lato-Italic"),
          url(https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-qNiXg7Q.woff2)
            format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* latin */
      @font-face {
        font-family: "Lato";
        font-style: italic;
        font-weight: 900;
        font-display: swap;
        src: local("Lato Black Italic"), local("Lato-BlackItalic"),
          url(https://fonts.gstatic.com/s/lato/v16/S6u_w4BMUTPHjxsI3wi_Gwftx9897g.woff2)
            format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* latin */
      @font-face {
        font-family: "Lato";
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local("Lato Regular"), local("Lato-Regular"),
          url(https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wXiWtFCc.woff2)
            format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* latin */
      @font-face {
        font-family: "Lato";
        font-style: normal;
        font-weight: 900;
        font-display: swap;
        src: local("Lato Black"), local("Lato-Black"),
          url(https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh50XSwiPGQ3q5d0.woff2)
            format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin */
      @font-face {
        font-family: "Lora";
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/lora/v16/0QI6MX1D_JOuGQbT0gvTJPa787wsuxJBkqt8ndeYxZ0.woff)
          format("woff");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* latin */
      @font-face {
        font-family: "Lora";
        font-style: italic;
        font-weight: 400;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/lora/v16/0QIhMX1D_JOuMw_LIftLtfOm8w.woff2)
          format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* latin */
      @font-face {
        font-family: "Lora";
        font-style: italic;
        font-weight: 500;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/lora/v16/0QIhMX1D_JOuMw_LIftLtfOm8w.woff2)
          format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }
    }

    html,
    body {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      font-family: "Lato", "Lucida Grande", "Lucida Sans Unicode", Tahoma,
        Sans-Serif;
    }

    table,
    td {
      font-family: "Lato", "Lucida Grande", "Lucida Sans Unicode", Tahoma,
        Sans-Serif;
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
    <div
      style="max-width: 620px; margin: 0 auto; padding: 50px 0"
      class="email-container"
    >
      <table
        align="center"
        cellspacing="0"
        cellpadding="0"
        border="0"
        width="100%"
        style="margin: auto"
      >
        <tbody>
          <tr style="background-color: rgb(255, 255, 255)">
            <td style="padding: 0 20px">
              <table style="margin: 0 !important; width: 100%">
                <tbody>
                  <tr>
                    <td
                      style="
                        padding: 20px 0;
                        text-align: left;
                        border-bottom: 1px solid #dddddd;
                      "
                    >
                      <a href="https://www.universityliving.com">
                        <img
                          src="https://cdn.universityliving.com/logo/logo.png"
                          height="50"
                          border="0"
                        />
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
            <td style="text-align: left">
              <p
                style="
                  padding: 20px;
                  font-weight: 900;
                  font-size: 30px;
                  color: #5e5e5e;
                  margin-top: 0;
                  margin-bottom: 0;
                "
              >
                Your password on University Living LMS has been reset
              </p>
            </td>
          </tr>

          <tr style="background-color: rgb(255, 255, 255)">
            <td style="padding: 20px">
              <table width="100%" cellpadding="0" border="0" cellspacing="0">
                <tr>
                  <td
                    style="
                      border: 1px solid #dddddd;
                      padding: 20px;
                      font-weight: bold;
                      font-size: 18px;
                    "
                  >
                    New Password Details
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      text-align: left;
                      border: 1px solid #dddddd;
                      padding: 20px;
                      font-size: 16px;
                    "
                  >
                    <strong>Email : </strong>${email}<br /><br />
                    <strong>Password : </strong>${password}<br /><br />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr style="background-color: rgb(255, 255, 255)">
            <td style="padding: 20px">
              Thanks <br />
              <strong>Team University Living</strong>

              <br /><br />
            </td>
          </tr>

          <tr style="background-color: #fff">
            <td style="padding: 0 0">
              <img
                src="https://cdn.universityliving.com/emailer/bottomEmail.png"
                border="0"
                style="
                  width: 100%;
                  max-width: 620px;
                  height: auto;
                  display: block;
                  background: white;
                "
              />
            </td>
          </tr>

          <tr style="background-color: #fbfbfb">
            <td style="padding: 0 20px">
              <table style="margin: 0 !important; width: 100%">
                <tbody>
                  <tr>
                    <td
                      style="
                        padding: 20px 0;
                        text-align: left;
                        border-bottom: 1px solid #dddddd;
                      "
                    >
                      <a href="https://www.universityliving.com">
                        <img
                          src="https://cdn.universityliving.com/logo/logo.png"
                          height="50"
                          alt="logo"
                          border="0"
                        />
                      </a>
                    </td>

                    <td
                      style="
                        text-align: right;
                        border-bottom: 1px solid #dddddd;
                      "
                    >
                      <p
                        style="
                          margin-top: 0;
                          color: rgb(58, 55, 97);
                          font-size: 14px;
                          font-style: italic;
                          margin-bottom: 4px;
                        "
                      >
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
                        <a
                          href="https://www.linkedin.com/school/university-living/"
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
                    <td
                      colspan="2"
                      style="
                        line-height: 2.5;
                        padding: 10px 0;
                        color: #929292;
                        text-align: center;
                        font-size: 12px;
                      "
                    >
                      Sent with ❤️ from University Living <br />
                      <ul
                        style="
                          width: 100%;
                          list-style: none;
                          overflow: hidden;
                          margin: 0 auto;
                          text-align: center;
                        "
                      >
                        <li
                          style="
                            float: left;
                            padding-right: 5px;
                            margin-left: 0;
                          "
                        >
                          <a
                            href="tel:+44-2045099650"
                            style="text-decoration: none; color: #646262"
                            >🇬🇧 +44 2045099650
                          </a>
                          |
                        </li>
                        <li
                          style="
                            float: left;
                            padding-right: 5px;
                            margin-left: 0;
                          "
                        >
                          <a
                            href="tel:+91-8287902210"
                            style="text-decoration: none; color: #646262"
                            >🇮🇳 +91 8287902210</a
                          >
                          |
                        </li>
                        <li
                          style="
                            float: left;
                            padding-right: 5px;
                            margin-left: 0;
                          "
                        >
                          <a
                            href="tel:+61-386090060"
                            style="text-decoration: none; color: #646262"
                            >🇦🇺 +61 386090060</a
                          >
                          |
                        </li>
                        <li
                          style="
                            float: left;
                            padding-right: 5px;
                            margin-left: 0;
                          "
                        >
                          <a
                            href="https://api.whatsapp.com/send?phone=442086380820&text=Hi"
                            style="text-decoration: none; color: #646262"
                            ><img
                              width="12px"
                              src="https://cdn.universityliving.com/icons/whatsapp.png"
                              alt=""
                            />
                            +44 2086380820</a
                          >
                        </li>
                      </ul>
                      © 2021 University Living Accommodations Pvt Ltd. |
                      <a
                        href="https://www.universityliving.com/terms-and-conditions"
                        style="text-decoration: none; color: #929292"
                        >Terms & Conditions</a
                      >
                      |
                      <a
                        href="https://www.universityliving.com/privacy-policy"
                        style="text-decoration: none; color: #929292"
                        >Privacy Policy</a
                      >
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
</html>
`;
};