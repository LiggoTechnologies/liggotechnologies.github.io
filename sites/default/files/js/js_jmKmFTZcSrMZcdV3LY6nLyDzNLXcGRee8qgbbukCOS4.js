/* global a2a*/
(function (Drupal) {
  'use strict';

  Drupal.behaviors.addToAny = {
    attach: function (context, settings) {
      // If not the full document (it's probably AJAX), and window.a2a exists
      if (context !== document && window.a2a) {
        a2a.init_all(); // Init all uninitiated AddToAny instances
      }
    }
  };

})(Drupal);
;
/**
 * @file
 * Attaches several event listener to a web page.
 */

(function ($, Drupal, drupalSettings) {

  /* eslint max-nested-callbacks: ["error", 4] */

  'use strict';

  Drupal.google_analytics = {};

  $(document).ready(function () {

    // Attach mousedown, keyup, touchstart events to document only and catch
    // clicks on all elements.
    $(document.body).on('mousedown keyup touchstart', function (event) {

      // Catch the closest surrounding link of a clicked element.
      $(event.target).closest('a,area').each(function () {

        // Is the clicked URL internal?
        if (Drupal.google_analytics.isInternal(this.href)) {
          // Skip 'click' tracking, if custom tracking events are bound.
          if ($(this).is('.colorbox') && (drupalSettings.google_analytics.trackColorbox)) {
            // Do nothing here. The custom event will handle all tracking.
            // console.info('Click on .colorbox item has been detected.');
          }
          // Is download tracking activated and the file extension configured
          // for download tracking?
          else if (drupalSettings.google_analytics.trackDownload && Drupal.google_analytics.isDownload(this.href)) {
            // Download link clicked.
            ga('send', {
              hitType: 'event',
              eventCategory: 'Downloads',
              eventAction: Drupal.google_analytics.getDownloadExtension(this.href).toUpperCase(),
              eventLabel: Drupal.google_analytics.getPageUrl(this.href),
              transport: 'beacon'
            });
          }
          else if (Drupal.google_analytics.isInternalSpecial(this.href)) {
            // Keep the internal URL for Google Analytics website overlay intact.
            ga('send', {
              hitType: 'pageview',
              page: Drupal.google_analytics.getPageUrl(this.href),
              transport: 'beacon'
            });
          }
        }
        else {
          if (drupalSettings.google_analytics.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
            // Mailto link clicked.
            ga('send', {
              hitType: 'event',
              eventCategory: 'Mails',
              eventAction: 'Click',
              eventLabel: this.href.substring(7),
              transport: 'beacon'
            });
          }
          else if (drupalSettings.google_analytics.trackOutbound && this.href.match(/^\w+:\/\//i)) {
            if (drupalSettings.google_analytics.trackDomainMode !== 2 || (drupalSettings.google_analytics.trackDomainMode === 2 && !Drupal.google_analytics.isCrossDomain(this.hostname, drupalSettings.google_analytics.trackCrossDomains))) {
              // External link clicked / No top-level cross domain clicked.
              ga('send', {
                hitType: 'event',
                eventCategory: 'Outbound links',
                eventAction: 'Click',
                eventLabel: this.href,
                transport: 'beacon'
              });
            }
          }
        }
      });
    });

    // Track hash changes as unique pageviews, if this option has been enabled.
    if (drupalSettings.google_analytics.trackUrlFragments) {
      window.onhashchange = function () {
        ga('send', {
          hitType: 'pageview',
          page: location.pathname + location.search + location.hash
        });
      };
    }

    // Colorbox: This event triggers when the transition has completed and the
    // newly loaded content has been revealed.
    if (drupalSettings.google_analytics.trackColorbox) {
      $(document).on('cbox_complete', function () {
        var href = $.colorbox.element().attr('href');
        if (href) {
          ga('send', {
            hitType: 'pageview',
            page: Drupal.google_analytics.getPageUrl(href)
          });
        }
      });
    }

  });

  /**
   * Check whether the hostname is part of the cross domains or not.
   *
   * @param {string} hostname
   *   The hostname of the clicked URL.
   * @param {array} crossDomains
   *   All cross domain hostnames as JS array.
   *
   * @return {boolean} isCrossDomain
   */
  Drupal.google_analytics.isCrossDomain = function (hostname, crossDomains) {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  };

  /**
   * Check whether this is a download URL or not.
   *
   * @param {string} url
   *   The web url to check.
   *
   * @return {boolean} isDownload
   */
  Drupal.google_analytics.isDownload = function (url) {
    var isDownload = new RegExp('\\.(' + drupalSettings.google_analytics.trackDownloadExtensions + ')([\?#].*)?$', 'i');
    return isDownload.test(url);
  };

  /**
   * Check whether this is an absolute internal URL or not.
   *
   * @param {string} url
   *   The web url to check.
   *
   * @return {boolean} isInternal
   */
  Drupal.google_analytics.isInternal = function (url) {
    var isInternal = new RegExp('^(https?):\/\/' + window.location.host, 'i');
    return isInternal.test(url);
  };

  /**
   * Check whether this is a special URL or not.
   *
   * URL types:
   *  - gotwo.module /go/* links.
   *
   * @param {string} url
   *   The web url to check.
   *
   * @return {boolean} isInternalSpecial
   */
  Drupal.google_analytics.isInternalSpecial = function (url) {
    var isInternalSpecial = new RegExp('(\/go\/.*)$', 'i');
    return isInternalSpecial.test(url);
  };

  /**
   * Extract the relative internal URL from an absolute internal URL.
   *
   * Examples:
   * - https://mydomain.com/node/1 -> /node/1
   * - https://example.com/foo/bar -> https://example.com/foo/bar
   *
   * @param {string} url
   *   The web url to check.
   *
   * @return {string} getPageUrl
   *   Internal website URL.
   */
  Drupal.google_analytics.getPageUrl = function (url) {
    var extractInternalUrl = new RegExp('^(https?):\/\/' + window.location.host, 'i');
    return url.replace(extractInternalUrl, '');
  };

  /**
   * Extract the download file extension from the URL.
   *
   * @param {string} url
   *   The web url to check.
   *
   * @return {string} getDownloadExtension
   *   The file extension of the passed url. e.g. 'zip', 'txt'
   */
  Drupal.google_analytics.getDownloadExtension = function (url) {
    var extractDownloadextension = new RegExp('\\.(' + drupalSettings.google_analytics.trackDownloadExtensions + ')([\?#].*)?$', 'i');
    var extension = extractDownloadextension.exec(url);
    return (extension === null) ? '' : extension[1];
  };

})(jQuery, Drupal, drupalSettings);
;
(function ($, Drupal) {

  var validator;
  var scrollY = 0;

  Drupal.behaviors.liggo_contact_overlay = {

    attach: function (context, settings) {
      Drupal.behaviors.liggo_contact_overlay.initLinks();
    },


    initLinks: function () {
      $(".open-contact-overlay").off("click").on("click", function (e) {
        e.preventDefault();
        Drupal.behaviors.liggo_contact_overlay.openModal("contact");
      });
      $(".open-newsletter-overlay").off("click").on("click", function (e) {
        e.preventDefault();
        Drupal.behaviors.liggo_contact_overlay.openModal("newsletter");
      });
      $(".open-freeDemo-overlay").off("click").on("click", function (e) {
        e.preventDefault();
        Drupal.behaviors.liggo_contact_overlay.openModal("freeDemo");
      });
    },

    openModal: function (type) {

      $("#contact-overlay").remove();
      var $el = $("<div id='contact-overlay' class='hidden'><div class='page-overlay'></div><div class='form-wrapper hidden'><div class='close'><img class='svg' src='" + drupalSettings.pathToTheme + "/images/close-white.svg'></div></div></div>");
      $("body").append($el);

      window.convertSVGToInline();

      $("#contact-overlay .page-overlay").off("click").on("click", function (e) {
        e.preventDefault();
        Drupal.behaviors.liggo_contact_overlay.closeModal();
      });

      $("#contact-overlay .close").off("click").on("click", function (e) {
        e.preventDefault();
        Drupal.behaviors.liggo_contact_overlay.closeModal();
      });

      // Remove page scrolling on mobile
      if (window.viewport().width < 550) {
        // Save scroll
        scrollY = window.scrollY;

        $("body").addClass("disable-scroll");
      }

      // Different form by language
      var formId;
      if (type == "contact") {
        formId = {
          "fr": "ff275358-f910-41fb-8340-96b14a1e563e",
          "en": "b33b7feb-c2ad-42f9-b631-1b633225161d"
        };

      } else if (type == "newsletter") {
        formId = {
          "fr": "2b9a17f9-2ed8-46a2-8c3d-5e34ff758a8f",
          "en": "cb1234de-1589-40ff-a5de-e1361811bb2f"
        };

        $("#contact-overlay").addClass("newsletter");
      } else if (type == "newsletter") {
        formId = {
          "fr": "a847e7cf-0b95-4ecb-a30e-0e97b8753d23",
          "en": "850d7a53-2b5b-4662-a586-f5af4449bbbc"
        };

        $("#contact-overlay").addClass("freeDemo");
      }
      // https://legacydocs.hubspot.com/docs/methods/forms/advanced_form_options
      hbspt.forms.create({
        portalId: "7435029",
        formId: formId[drupalSettings.currentLanguage],
        target: "#contact-overlay .form-wrapper",
        onFormReady: Drupal.behaviors.liggo_contact_overlay.iframeReady,
        onFormSubmitted: Drupal.behaviors.liggo_contact_overlay.closeModal,
        locale: drupalSettings.currentLanguage,
        translations: {
          fr: {
            submitText: "Envoyer",
          },
          en: {
            submitText: "Submit",
          }
        }
      });

      requestAnimationFrame(function () {
        $("#contact-overlay").removeClass("hidden");
      })
    },

    iframeReady: function () {

      // CSS overrides, the dirty way
      jQuery('.hs-form-iframe').contents().find("head").append($("<style type='text/css'> form { width:100% !important; } .hs-richtext { margin-bottom: 25px; } .hs-input { font-family: 'TT Norm', sans-serif; font-weight: normal; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #072824; border-radius: 0 !important; background-color: #f5f8fa !important; border: none !important; } .hs-input::placeholder { color: #072824; } .hs-input.error { border: 1px solid #c87872 !important; } .field { margin-bottom: 15px; } .hs-button { font-family: 'TT Norm', sans-serif; font-weight: normal; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-radius: 25px; padding: 15px 45px; outline: none; transition: background-color 0.25s cubic-bezier(0.250, 0.460, 0.450, 0.940), border-color 0.25s cubic-bezier(0.250, 0.460, 0.450, 0.940), color 0.25s cubic-bezier(0.250, 0.460, 0.450, 0.940); } .hs-button:hover { border-color: #FFFFFF !important; background-color: #FFFFFF !important; color: #4eb473 !important; } .actions { margin-top: 0px; text-align: center !important; } </style>"));
      $("#contact-overlay .form-wrapper").removeClass("hidden");
    },

    closeModal: function () {
      if (window.viewport().width < 550 && !$("#header .mobile-toggle").is(".is-active")) {
        $("body").removeClass("disable-scroll");

        // Keep same scroll
        requestAnimationFrame(function () {
          window.scrollTo(0, scrollY);
        });
      }

      $("#contact-overlay .form-wrapper").addClass("hidden").one(window.transitionEnd, function (e) {
        e.stopImmediatePropagation();
        $("#contact-overlay").addClass("hidden").one(window.transitionEnd, function (e) {
          e.stopImmediatePropagation();
          $("#contact-overlay").remove();
        });
      });
    },

  }

})
(jQuery, Drupal, this, this.document);
;
