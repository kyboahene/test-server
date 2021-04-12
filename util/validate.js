module.exports.validRegisterInput = (
  username,
  email,
  password,
  confirmPassword,
) => {
  const errors = {}
  if (username.trim() == '') {
    errors.username = 'Username is required'
  }

  if (email.trim() == '') {
    errors.email = 'Email is required'
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address'
    }
  }

  if (password == '') {
    errors.password = 'Password is required'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validLoginInput = (email, password) => {
  const errors = {}
  if (email.trim() == '') {
    errors.email = 'Email is required'
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address'
    }
  }

  if (password == '') {
    errors.password = 'Password is required'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validProspectInput = (fname, Lname, email, phone) => {
  const errors = {}

  if (fname.trim() == '') {
    errors.fname = 'First Name is required'
  }

  if (Lname.trim() == '') {
    errors.Lname = 'Last Name is required'
  }

  if (email.trim() == '') {
    errors.email = 'Email is required'
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address'
    }
  }

  if (phone.trim() !== '') {
    const x = parseInt(phone)

    if (Number.isInteger(x)) {
      const phoneno = /^\d{10}$/
      var phoneno1 = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

      if (!phone.match(phoneno) && !phone.match(phoneno1)) {
        errors.phone = 'Input a valid phone number'
      }
    } else {
      errors.phone = 'Input a valid phone number'
    }
  } else {
    errors.phone = 'Phone is required'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validDLicenseInput = (DofBirth, Number, State) => {
  const errors = {}

  console.log(DofBirth, Number, State)

  if (DofBirth.trim() !== '') {
    errors.DofBirth = 'Date is required'
  }

  if (Number.trim() == '') {
    errors.Number = 'Number is required'
  }

  if (State.trim() == '') {
    errors.State = 'State is required'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}
