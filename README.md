# inputmagnify
Input放大镜，像在输入手机号或身份证号码时，每四位插入一个分隔符。

默认采用bootstrap标签样式（label label-success），也可以重写 `.input-magnify` 类样式来调整显示器样式。

# 使用

1.  依赖于jQuery。
2.  分别引用src.js文件。

## css

```css
.input-magnify {
    position: absolute;
    font-size: 18px;
}
.input-magnify.in {
    filter: alpha(opacity=90);
    opacity: .9;
}
```

## javascript 方式

```javascript
$('#mobile').inputmagnify({
    placement: 'bottom'
});
```

## html 方式

```html
<input type="text" data-cipchk="inputmagnify" data-first_digit="4" />
```

所有参数都支持 `data-*` 的形式。

# 参数

+  *animation*：显示时是否带动画效果，（boolean：true）。
+  *placement*：放大镜位置，（字符串：top、left、right、bottom）。
+  *first_digit*：首次间隔位数，比如手机号前3位需要分隔，当为0时不参与（整数：3）。
+  *interval_digit*：除首次间隔外，剩下字符间隔位数，（整数：4）。
+  *works*：间隔字符，（字符串：半角空格）。
+  *template*：显示器模板文件。
+  *container*：显示器HTML置放位置，（jQuery对象：默认放到input后面）。
