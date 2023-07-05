// Đối tượng `Validator`
function Validator(options) {
  let selectorRules = {};
  // Hàm thực hiện Validate
  function Validate(inputElement, rule) {
    let errorElement = inputElement.parentElement.querySelector(options.errorSelector);
    let errorMesssage;

    // lấy ra các rules của selector
    let rules = selectorRules[rule.selector];

    // lặp qua từng rule && kiểm tra
    // Nếu có lỗi thì dừng việc kiểm tra
    for (let i = 0; i < rules.length; ++i) {
      errorMesssage = rules[i](inputElement.value);
      if (errorMesssage) break;
    }

    if (errorMesssage) {
      errorElement.innerText = errorMesssage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
    return !errorMesssage;
  }

  // Lấy element của form cần validate
  let formElement = document.querySelector(options.form);

  if (formElement) {
    // khi submit form
    formElement.onsubmit = (e) => {
      e.preventDefault();
      let isFormValid = true;

      // Lặp qua từng rules và validate
      options.rules.forEach((rule) => {
        let inputElement = formElement.querySelector(rule.selector);
        let isValid = Validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // trường hợp submit với js
        if (typeof options.onSubmit === "function") {
          let enableInputs = formElement.querySelectorAll("[name]:not([disable])");

          let formValues = Array.from(enableInputs).reduce((values, input) => {
            return (values[input.name] = input.value) && values;
          }, {});

          options.onSubmit(formValues);
        }
        // Trường hợp submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }
    };

    //Lặp qa mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
    options.rules.forEach((rule) => {
      // lưu lại các rules cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      let inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        // Xử lý trường hợp blur khỏi input
        inputElement.onblur = () => {
          Validate(inputElement, rule);
        };

        // Xử lý mỗi khi người dùn nhập vào input
        inputElement.oninput = () => {
          let errorElement = inputElement.parentElement.querySelector(options.errorSelector);
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}

// Định luật rules
// Nguyên tắc của các rules:
// 1. khi có lỗi => trả ra messa lỗi
// 2. khi hợp lệ => ko trả ra cái gì cả (undefined)
Validator.isRequired = (selector, mess) => {
  return {
    selector: selector,
    test: (value) => {
      return value.trim() ? undefined : mess || "vui lòng nhập trường này";
    },
  };
};
Validator.isEmail = (selector, mess) => {
  return {
    selector: selector,
    test: (value) => {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : mess || "Vui lòng nhập email";
    },
  };
};
Validator.minLength = (selector, min, mess) => {
  return {
    selector: selector,
    test: (value) => {
      return value.length >= min ? undefined : mess || `Vui lòng nhập tối thiểu ${min} ký tự`;
    },
  };
};

Validator.isConfirmed = (selector, getConfirmValue, mess) => {
  return {
    selector: selector,
    test: (value) => {
      return value === getConfirmValue() ? undefined : mess || "Giá trị nhập vào không chính xác";
    },
  };
};
