## HTML DOM

3 thành phần

1. element
2. att
3. text

---

Javascript: Browser | Server (nodejs)

Browser: html -> dom -> web api

---

## ES 6

Destructuring tạo 1 mảng hoặc đối tượng để lấy những thứ cần thiết ra sử dụng

```c
const vehicles = ['mustang', 'f-150', 'expedition'];

const [car,, suv] = vehicles;
```

Spread tạo 1 mảng hoặc đối tượng dùng để sao chép đối tượng hay mảng khác. Có thể sửa thuộc tính các obj vs mảng theo tùy ý.

```c
const myVehicle = {
  brand: 'Ford',
  model: 'Mustang',
  color: 'red'
}

const updateMyVehicle = {
  type: 'car',
  year: 2021,
  color: 'yellow'
}

const myUpdatedVehicle = {...myVehicle, ...updateMyVehicle}
```

Rest nhận tất cả các tham số còn lại trong mảng hoặc obj

---

## Form-validation

I. Tạo 1 đối tượng Validator

- cho nhiều đối tượng sử dụng lại
- bắt lỗi khi nhập sai => sẽ hiển thị thông báo
- blur: khi rời khỏi trường nếu mà điều kiện hk phù hợp sẽ thông báo lỗi
- oninput: khi đang nhập xóa thbao điều kiện nhập sai của trường

II.

- bắt lỗi từng trường hợp(nhập sai cấu trúc email, tối thiểu kí tự mật khẩu, khoảng cách trắng)
- bắt nhiều lỗi trong 1 trường(vd: input bỏ trống ->báo lỗi , khi input có kí tự mà hk đúng yêu cầu email -> báo lỗi)
- xử lý submit
- lấy tất cả thuộc tính trong element
- biến đổi từ nodeList -> ArrayList
- Callback
- lựa chọn radio/checkbox
