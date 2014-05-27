(function($) {

    // The validation type (class).
    // We adds validation rules for email, required field, password and url.
    var Validation = function() {

        var rules = {

            email : {
                check: function(value) {

                    if (value)
                        return isValidatedPattern(value, /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
                    return false;
                },
                msg : "Please enter a valid e-mail address."
            },
            url : {
                check : function(value) {

                    if (value)
                        return isValidatedPattern(value, /^https?:\/\/(.+\.)+.{2,4}(\/.*)?$/);
                    return true;
                },
                msg : "Please enter a valid URL."
            },
            password : {
                check: function(value) {
                    if (value.length < 8 || value.length > 20) {
                        return false;
                    }
                    else {
                        // Check the password strength enough.
                        return isValidatedPattern(value, /(?=[A-Za-z0-9]{8,20})(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+/);
                    }
                },
                msg : "Your password must be at least 8 characters long."
            },
            required : {
                check: function(value) {

                    if (value)
                        return true;
                    else
                        return false;
                },
                msg : "This field is required."
            }
        }
        var isValidatedPattern = function(value, pattern) {

            var regex = pattern;
            var match = regex.exec(value);
            return match;
        }

        // Returns a publish method, then the user can custom validation rule.
        return {
            // The user can add their custom rule.
            addRule : function(name, rule) {

                rules[name] = rule;
            },
            getRule : function(name) {

                return rules[name];
            }
        }
    }
    


    // The form object.
    var Form = function(form) {

        var fields = [];

        // Find the field has the validation attribute.
        form.find("[validation]").each(function() {
            var field = $(this);
            if (field.attr('validation') !== undefined) {
                fields.push(new Field(field));
            }
        });
        this.fields = fields;
    }

    // The prototype of Form.
    Form.prototype = {

        // Validates all the fields in the form object.
        validate : function() {

            for (field in this.fields) {

                this.fields[field].validate();
            }
        },

        // If the field invaild, focus on it.
        isValid : function() {

            for (field in this.fields) {

                if (!this.fields[field].valid) {

                    this.fields[field].field.focus();
                    return false;
                }
            }
            return true;
        }
    }

    // The Field type.
    var Field = function (field) {

        this.field = field;
        this.valid = false;
        this.attach("change");
    }

    // The prototype of Field type.
    Field.prototype = {

        // Public method.
        attach : function(event) {

            // The object refers to Field object.
            var obj = this;

            // When the field changed, then invoked the validate method.
            if (event == "change") {
                obj.field.bind("change", function() {
                    return obj.validate();
                });
            }

            // When Key up, then invoked the validate method.
            if (event == "keyup") {
                obj.field.bind("keyup", function() {
                    return obj.validate();
                });
            }
        },

        // Public method.
        validate : function() {

            var obj = this,
                field = obj.field,
                errorClass = "errorlist",
                errorlist = $(document.createElement("ul")).addClass(errorClass),

                // We can splits the validation attribute with space.
                // Gets all validation types.
                types = field.attr("validation").split(" "),

                // Gets the fieldgroud object.
                container = field.parent(),
                errors = [];

            // If there is an errorlist already present
            // remove it before performing additional validation
            field.next(".errorlist").remove();
            
            for (var type in types) {

                var rule = $.Validation.getRule(types[type]);

                // If invalid displays the error msg.
                if (!rule.check(field.val())) {

                    container.addClass("error");
                    errors.push(rule.msg);
                }
            }
            if (errors.length) {

                // Unbinds the keyup event added before.
                obj.field.unbind("keyup")

                // Attaches the keyup event.
                obj.attach("keyup");
                field.after(errorlist.empty());

                // Displays the error msg.
                for (error in errors) {

                    errorlist.append("<li>" + errors[error] + "</li>");
                }
                obj.valid = false;
            }
            else {
                errorlist.remove();
                container.removeClass("error");
                obj.valid = true;
            }
        }
    }


    // Extends jQuery prototype with validation and validate methods.
    $.extend($.fn, {

        validation : function() {

            // Creates a Form instance.
            var validator = new Form($(this));

            // Stores the Form instance in Key/Value collection.
            $.data($(this)[0], 'validator', validator);

            // Binds the submit event.
            $(this).bind("submit", function(e) {
                validator.validate();
                if (!validator.isValid()) {
                    e.preventDefault();
                }
            });
        },

        // Checks the field is validated or not.
        validate : function() {

            var validator = $.data($(this)[0], 'validator');
            validator.validate();
            return validator.isValid();

        }
    });

    //Creates instance of our object in the jQuery namespace.
    $.Validation = new Validation();
})(jQuery);
