/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * FormView plugin to convert a placeholder into a
 * floating label if the input changes. Behavior is automatically
 * hooked up in `afterRender`
 */

define(function (require, exports, module) {
  'use strict';

  var $ = require('jquery');

  module.exports = {
    events: {
      'blur input': 'onInputBlur',
      'focus input': 'onInputFocus',
      'input input[placeholder]': 'floatingPlaceholderMixinOnInput'
    },

    afterRender: function () {
      this.updateFormValueChanges();
    },

    /**
     * Force the display of the floating placeholder field
     * for an element
     *
     * @param {object} inputEl - input element whose placeholder
     *        should be shown.
     */
    showFloatingPlaceholder: function (inputEl) {
      var placeholder = this.$el.find(inputEl).attr('placeholder');

      // If the placeholder for the element was already converted, no
      // further conversion will occur.
      // The check for existence is because of the strict equality check,
      // if placeholder is undefined, then it should not go into the block
      if (placeholder && placeholder !== '') {
        this.$el.find(inputEl).removeAttr('placeholder');
        this.$el.find(inputEl).prev('.label-helper').text(placeholder).css({'top': '-17px'});
      }
    },

    focusFloatingPlaceholder: function (inputEl) {
      this.$el.find(inputEl).prev('.label-helper').addClass('focused');
    },

    unfocusFloatingPlaceholder: function (inputEl) {
      this.$el.find(inputEl).prev('.label-helper').removeClass('focused');
    },

    /**
     * The ridiculous name is to avoid collisions with
     * functions on consumers.
     */
    floatingPlaceholderMixinOnInput: function (event) {
      var $inputEl = $(event.currentTarget);

      // If no form values have changed, no need to show the
      // placeholder text.
      if (! this.detectFormValueChanges()) {
        return;
      }

      this.showFloatingPlaceholder($inputEl);
      this.focusFloatingPlaceholder($inputEl);
    },

    onInputFocus: function (event) {
      this.focusFloatingPlaceholder($(event.currentTarget));
    },

    onInputBlur: function (event) {
      this.unfocusFloatingPlaceholder($(event.currentTarget));
    }
  };
});
