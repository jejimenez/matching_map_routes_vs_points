//login form validation
(function ($) {
$('.ui.form.login').form({  
    on: 'blur',
    fields: {     
      email: {
        identifier: 'Email',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your email'
        },{
          type: 'email',
          prompt: 'Please enter a valid email'
        }]
      },       
      password: {
        identifier: 'Password',
        rules: [{
          type: 'empty',
          prompt: 'Please enter a password'
        },{
          type: 'length[6]',
          prompt: 'Password needs to be atleast 6 characters long'
        }]
      }
    }
  });
}(jQuery));

    (function ($) {
      $('.ui.form.segment').form({
        givenName: {
          identifier: 'GivenName',
          rules: [{
            type: 'empty',
            prompt: 'Please enter your given name'
          }]
        },
        surname: {
          identifier: 'Surname',
          rules: [{
            type: 'empty',
            prompt: 'Please enter your surname'
          }]
        },
        username: {
          identifier: 'Username',
          rules: [{
            type: 'empty',
            prompt: 'Please enter a username'
          }]
        },
        email: {
          identifier: 'Email',
          rules: [{
            type: 'empty',
            prompt: 'Please enter your email'
          }, {
            type: 'email',
            prompt: 'Please enter a valid email'
          }]
        },
        password: {
          identifier: 'Password',
          rules: [{
            type: 'empty',
            prompt: 'Please enter a password'
          }, {
            type: 'length[6]',
            prompt: 'Password needs to be atleast 6 characters long'
          }]
        },
        passwordConfirm: {
          identifier: 'PasswordConfirm',
          rules: [{
            type: 'match[Password]',
            prompt: 'Password don\'t match'
          }]
        }
      }, {
        on: 'blur'
      });
    }(jQuery));