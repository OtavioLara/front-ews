<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card bg-dark text-white" style="border-radius: 1rem;">
            <div class="card-body p-5 text-center">

              <div class="mb-md-5 mt-md-4">

                <h2 class="fw-bold mb-2 text-uppercase">Sign Up</h2>
                <p class="text-white-50 mb-5">Create your account!</p>
                <form class="container">
                  <div class="form-outline mb-4 input-box">
                    <input v-model="name" placeholder=" " type="text" class="form-control form-control-lg bg-dark text-white" 
                    :class="{ 
                        'is-valid': (inputs_class.name || false) && inputs_class.name.valid, 
                        'is-invalid': (inputs_class.name || false) && inputs_class.name.invalid
                      }" required/>
                    <span class="label" id="span-name">Name</span>
                  </div>
                  
                  <div class="form-outline mb-4 input-box">
                    <input maxlength="14" v-model="cpf" placeholder=" " type="text" class="form-control form-control-lg bg-dark text-white"
                    :class="{ 
                        'is-valid': (inputs_class.cpf || false) && inputs_class.cpf.valid, 
                        'is-invalid': (inputs_class.cpf || false) && inputs_class.cpf.invalid 
                      }"
                    required/>
                    <span class="label" id="span-cpf">CPF</span>
                  </div>

                  <div class="form-outline mb-4 input-box">
                    <input v-model="email" placeholder=" " type="email" class="form-control form-control-lg bg-dark text-white"
                    :class="{ 
                        'is-valid': (inputs_class.email || false) && inputs_class.email.valid, 
                        'is-invalid': (inputs_class.email || false) && inputs_class.email.invalid
                      }" required/>
                    <span class="label" id="span-email">Email</span>
                  </div>

                  <div class="form-outline mb-4 input-box">
                    <input v-model="password" placeholder=" " type="password" class="form-control form-control-lg bg-dark text-white" 
                    :class="{ 
                        'is-valid': (inputs_class.password || false) && inputs_class.password.valid, 
                        'is-invalid': (inputs_class.password || false) && inputs_class.password.invalid 
                      }"
                    required/>
                    <span class="label">Password</span>
                  </div>

                  <div class="form-outline mb-4 input-box">
                    <input v-model="repeat_password" placeholder=" " type="password" class="form-control form-control-lg bg-dark text-white" 
                    :class="{ 
                        'is-valid': (inputs_class.repeat_password || false) && inputs_class.repeat_password.valid, 
                        'is-invalid': (inputs_class.repeat_password || false) && inputs_class.repeat_password.invalid 
                      }"
                    required/>
                    <span class="label" id="span-password-repeat">Repeat Password</span>
                  </div>

                </form>
                <button v-on:click="createAccount" class="btn btn-outline-light btn-lg px-5" type="submit">Sign Up</button>
                <div class="error-message">{{error_message}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import './signup-view.css';
  import Account from '@/services/account';
  import router from '@/router';
  function isCpfValid(cpf) {
    let pt_1 = cpf.split('-')[0].split('.').join('')
    let [verification_digit_1, verification_digit_2] = cpf.split('-')[1].split('').map((v) => parseInt(v))

    let step_1 = pt_1.split('').map((v) => parseInt(v)).reduce((acc, curValue, index) => {
      return acc + (curValue * (10 - index))
    }, 0)

    step_1 = ((step_1 * 10) % 11) % 10;
    if (step_1 != verification_digit_1){
      return false;
    }
    
    let pt_2 = [...pt_1.split('').map((v) => parseInt(v)), verification_digit_1]
    let step_2 = pt_2.reduce((acc, curValue, index) => {
      return acc + (curValue * (11 - index))
    }, 0)
    step_2 = ((step_2 * 10) % 11) % 10;
    if (step_2 != verification_digit_2){
      return false;
    }
    return true
  }

  export default {
    name: 'SignUpView',
    data() {
      return {
        name: '',
        cpf: '',
        email: '',
        password: '',
        repeat_password: '',
        error_message: '',
        inputs_class: {}
      }
    },
    methods: {
      isValid(regex, value, obj_str) {
        if(!value.match(regex)){
          this.inputs_class[obj_str] = {invalid: true};
          this.inputs_class[obj_str] = {valid: false};
          return false
        } else {
          this.inputs_class[obj_str] = {invalid: false};
          this.inputs_class[obj_str] = {valid: true};
          return true
        }
      },
      createAccount() {

        if(!this.isValid(/[\S]*[a-zA-Z\s]+[\S]*$/y, this.name, 'name')){
          return;
        }
        if(!this.isValid(/[-.\w]+@([\w-]+\.)+[\w-]+/y, this.email, 'email')){
          return;
        }
        if(!this.cpf.match(/^(?<c1>[0-9]{3})\.(?<c2>[0-9]{3})\.(?<c3>[0-9]{3})-(?<c4>[0-9]{2})$/y) || this.cpf.length != 14){
          this.inputs_class.cpf = {invalid: true};
          return;
        } else {
          if(isCpfValid(this.cpf)){
            this.inputs_class.cpf = {valid: true};
          } else{
            this.inputs_class.cpf = {invalid: true};
            return;
          }
        }

        if(this.password != this.repeat_password) { 
          this.inputs_class.password = {invalid: true};
          this.inputs_class.repeat_password = {invalid: true};
          this.error_message = "The passwords doesn't match";
          return;
        } else {
          this.inputs_class.password = {valid: true};
          this.inputs_class.repeat_password = {valid: true};
        }
        
        let account_dto = {
          customerDTO:{
            name: this.name,
            cpf: this.cpf,
            email: this.email,
          },
          password: this.password,
        }
        Account.registryAccount(account_dto)
              .then(function (response) {
          console.log(response);
          router.push('/')
        })
        .catch(function (error) {
          console.log(error);
          this.error_message = 'error in sign up customer'
        });
      }
    },
    watch: {
        name(val) {
          this.isValid(/[\S]*[a-zA-Z\s]+[\S]*$/y, val, 'name')
        },
        cpf(val) {
          let regex = /^(?<c1>[0-9]{3})\.?(?<c2>[0-9]{3})\.?(?<c3>[0-9]{3})-?(?<c4>[0-9]{2})$/y;
          this.cpf = val.replace(regex, '$<c1>.$<c2>.$<c3>-$<c4>');
          if(val == '') {
            this.inputs_class.cpf = {invalid: false};
            this.inputs_class.cpf = {valid: false};
          } else {
            if(val.match(/^(?<c1>[0-9]{3})\.(?<c2>[0-9]{3})\.(?<c3>[0-9]{3})-(?<c4>[0-9]{2})$/y)) {
              if(isCpfValid(this.cpf)) {
                this.inputs_class.cpf = {valid: true};
              } else{
                this.inputs_class.cpf = {invalid: true};
              }
            } else {
              this.inputs_class.cpf = {invalid: true};
            }
          }
        },
        password() {
          if(this.password == '' || this.repeat_password == ''){
            this.inputs_class.password = {invalid: false};
            this.inputs_class.repeat_password = {invalid: false};
            this.inputs_class.password = {valid: false};
            this.inputs_class.repeat_password = {valid: false};
          }
          else if(this.password != this.repeat_password) {
            this.inputs_class.password = {invalid: true};
            this.inputs_class.repeat_password = {invalid: true};
          } else {
            this.inputs_class.password = {valid: true};
            this.inputs_class.repeat_password = {valid: true};
          }
        },
        repeat_password() {
          if(this.password == '' || this.repeat_password == '') {
            this.inputs_class.password = {invalid: false};
            this.inputs_class.repeat_password = {invalid: false};
            this.inputs_class.password = {valid: false};
            this.inputs_class.repeat_password = {valid: false};
          }
          else if(this.password != this.repeat_password) {
            this.inputs_class.password = {invalid: true};
            this.inputs_class.repeat_password = {invalid: true};
          } else {
            this.inputs_class.password = {valid: true};
            this.inputs_class.repeat_password = {valid: true};
          }
        },
        email(val) {
          this.isValid(/[-.\w]+@([\w-]+\.)+[\w-]+/y, val, 'email')
        }
    }
  }
</script>