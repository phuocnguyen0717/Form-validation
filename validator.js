// Đối tượng `Validator`
function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  let selectorRules = {};
  // Hàm thực hiện Validate
  function Validate(inputElement, rule) {
    let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
    let errorMessage;

    // lấy ra các rules của selector
    let rules = selectorRules[rule.selector];

    // lặp qua từng rule && kiểm tra
    // Nếu có lỗi thì dừng việc kiểm tra
    for (let i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errorMessage = rules[i](formElement.querySelector(rule.selector + ":checked"));
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add("invalid");
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove("invalid");
    }
    return !errorMessage;
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
          let enableInputs = formElement.querySelectorAll("[name]");

          let formValues = Array.from(enableInputs).reduce((values, input) => {
            switch (input.type) {
              case "radio":
                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                break;
              case "checkbox":
                if (!input.matches(":checked")) {
                  values[input.name] = "";
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }
            return values;
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

      let inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach((inputElement) => {
        inputElement.onblur = () => {
          Validate(inputElement, rule);
        };

        // Xử lý mỗi khi người dùng nhập vào input
        inputElement.oninput = () => {
          let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
          errorElement.innerText = "";
          getParent(inputElement, options.formGroupSelector).classList.remove("invalid");
        };
      });
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
      return value ? undefined : mess || "vui lòng nhập trường này";
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
