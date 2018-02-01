/**
 * Send salesforce Web to Lead form using fields from an existing form
 *
 * @usage
 * SalesforceWTL.init({
 *     action: "http://...",
 *     formId: "something",
 *     mapping: {
 *         "original_name" : "salesforce_name",
 *         ...,
 *     },
 *     additionalFields: {
 *         "salesforce_name" : "value",
 *         ...
 *     },
 *     dataTransform: {
 *          "salesforce_name" : function(){} // Transformation function
 *     }
 *     directSubmit: true/false,
 *     debugEmail: "something@tld.com",
 *     afterSubmit: function(){} // Callback function
 * });
 *
 * @author Daniele Lenares <daniele.lenares@gmail.com>
 */

var SalesforceWTL = {
    init: function(params) {

        if (params === undefined) return false;

        /**
         * Create salesforce iframe for form
         *
         * @return {Object} Iframe DOM Element
         */
        function _createFakeIframe() {
            var iframe = document.createElement('iframe');
            iframe.name = "sfwtlframe";
            iframe.id = "sfwtlframe";
            iframe.src = "about:blank";
            iframe.style.display = "none";
            if (params.hasOwnProperty("afterSubmit") && params.afterSubmit != "") {
                iframe.onload = params.afterSubmit;
            }
            document.body.appendChild( iframe );
            return iframe;
        }

        /**
         * Create salesforce POST form
         *
         * @param  {Object} iframe Iframe DOM Element
         * @return {Object}        Form DOM Element
         */
        function _createFakeForm(iframe) {
            var form = document.createElement('form');
            form.name = 'sfwtlform';
            form.id = 'sfwtlform';
            form.action = params.action;
            form.method = 'POST';
            form.target = 'sfwtlframe';
            form.style.display = 'none';
            form.setAttribute('data-sent', false);
            document.body.appendChild(form);
            return form;
        }

        /**
         * Map existing form fields with specified name
         *
         * @param  {Object} form The salesforce fake form
         */
        function _mapFields(form) {

            var originalForm = document.getElementById(params.formId);

            if (params.hasOwnProperty('mapping')) {

                for(var i = 0; i < originalForm.elements.length; i++) {

                    if ( originalForm.elements[i].type == 'checkbox' && originalForm.elements[i].checked == false ) continue;

                    var originalName = originalForm.elements[i].name;
                    var value = originalForm.elements[i].value;
                    if (params.mapping[originalName] !== undefined) {
                        var input = document.createElement('input');
                        var sfName = params.mapping[originalName];
                        input.id = sfName;
                        input.name = sfName;
                        input.type = 'hidden';
                        input.value = _executeDataTransform( sfName, value );
                        form.appendChild(input);
                    }
                }

            } else {
                for(var i = 0; i < originalForm.elements.length; i++) {
                    if ( originalForm.elements[i].type == 'checkbox' && originalForm.elements[i].checked == false ) continue;
                    var value = originalForm.elements[i].value;
                    var name = originalForm.elements[i].name;
                    var input = document.createElement('input');
                    input.id = name;
                    input.name = name;
                    input.value = _executeDataTransform( name, value );
                    input.type = 'text';
                    form.appendChild(input);
                }
            }
        }

        /**
         * Transform input value
         *
         * @param input
         * @returns {*|string}
         */
        function _executeDataTransform(name, origValue) {
            if ( params.hasOwnProperty('dataTransform')  && params.dataTransform.hasOwnProperty( name ) ) {
                var func = params.dataTransform[name];
                return func(origValue);
            }
            return origValue;
        }

        /**
         * Append additional fields to salesforce fake form
         * @param  {Object} form The salesforce fake form
         */
        function _appendAdditionalFields(form) {
            if (params.hasOwnProperty('additionalFields')) {
                for(var name in params.additionalFields) {
                    var input = document.createElement('input');
                    input.id = name;
                    input.name = name;
                    input.type = 'hidden';
                    input.value = params.additionalFields[name];
                    form.appendChild(input);
                }
            }

            if (params.hasOwnProperty('debugEmail') && params.debugEmail !== '') {
                var input = document.createElement('input');
                input.id = 'debug';
                input.name = 'debug';
                input.type = 'hidden';
                input.value = '1';
                form.appendChild(input);
                var input = document.createElement('input');
                input.id = 'debugEmail';
                input.name = 'debugEmail';
                input.type = 'hidden';
                input.value = params.debugEmail;
                form.appendChild(input);
            }
        }

        /**
         * Create and submit the salesforce form
         * @param  {Object} form The salesforce fake form
         */
        function _submitForm() {

            var sfIframe = _createFakeIframe();
            var sfForm = _createFakeForm( sfIframe );

            if (params.hasOwnProperty('directSubmit') && params.directSubmit === true) {
                _mapFields(sfForm);
                _appendAdditionalFields(sfForm);

                sfForm.submit();

                var originalForm = document.getElementById( params.formId );
                originalForm.setAttribute('data-salesforcesent', true);

            } else {
                document.getElementById(params.formId).addEventListener('submit', function(event) {

                    _mapFields(sfForm);
                    _appendAdditionalFields(sfForm);

                    event.preventDefault();
                    sfForm.submit();

                    var originalForm = document.getElementById(params.formId);
                    originalForm.setAttribute('data-salesforcesent', true);

                });
            }
        }

        _submitForm();
    }
};
