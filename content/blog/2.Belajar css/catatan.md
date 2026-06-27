---
title: Belajar CSS
description: Belajar CSS
tags: ["belajar-css"]
category: "belajar-css"
author: chigusa-asuha
date: 2026-06-29
---

# Langkah pertama menguasai CSS
## Apa itu CSS
Css (Cascading Style Sheet) adalah bahasa untuk mempercantik tampilan wesbite secara visual

Aturan penulisan css
```css
selector {
    property: value;
}

h1 {
    color: red;
}
```

## Css luas tapi jangan khawatir
lakukan googling dan cari referensi yang sesuai dengan yang ingin di buat.Jangan coba untuk menghafal syntax,namun pahami apa yang akan dibuat dan yang dicari

## Menggunakan css dengan benar di html
- inline css 
```html
<h1 style="color: red;">Hello World</h1>
```
- internal css,biasanya diletakkan dibagain `<head>` dibawah `<title>`      

```html
<head>
    <title>Document</title>
    <style>
        h1 {
            color: red;
        }
    </style>
</head>
<body>
    <h1>Hello World</h1>
</body>
```

- external css

style.css
```css
h1 {
    color: red;
}
```

index.html
```html
<link rel="stylesheet" href="style.css">
<h1>Hello World</h1>
```

dari ketiga cara diatas yang terbaik adalah external css,karena internal dan inline hanya bisa digunakan dalam 1 halaman dan harus menulis ulang kode pata tiap halaman,selain itu dengan menggunakan external css kode terlihat lebih rapi dan lebih mudah dibaca

## Mengenal properti color dan background-color
- color,merupakan properti untuk mengatur warna teks
- background-color,merupakan properti untuk mengatur warna latar
```css
h1 {
    color: red;
    background-color: blue;
}
```

## Sistem warna pada css
- rgb,merupakan sistem warna yang menggunakan nilai red,green,blue
```css
h1 {
    color: rgb(255, 0, 0);
}
```
- rgba,merupakan sistem warna yang menggunakan nilai red,green,blue,alpha yang memiliki transparansi

```css
h1 {
    color: rgba(255, 0, 0, 0.5);
}
```
- keyword,merupakan sistem warna yang menggunakan nama warna seperti red,blue,green,dll
```css
h1 {
    color: red;
}
```

## Mengenal properti text pada umumnya
`text-align`,merupakan properti untuk mengatur posisi teks

https://developer.mozilla.org/en-US/docs/Web/CSS/text-align

```css
h1 {
    text-align: center;
}
```

`font-weight`,merupakan properti untuk mengatur tebal teks

https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight

```css
h1 {
    font-weight: bold;
}
```

`text-decoration`,merupakan properti untuk mengatur decorasi teks

https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration

```css
h1 {
    text-decoration: underline;
}
```

`line-height`,merupakan properti untuk mengatur jarak baris teks
https://developer.mozilla.org/en-US/docs/Web/CSS/line-height

```css
h1 {
    line-height: 1.5;
}
```

## Mengenal satuan ukuran pada css dengan font
Relative ,merupakan satuan yang sering diguanakan untuk membuat website responsive
`em` ,`rem`, `%`, `px`,

Absolute,merupakan satuan yang tidak berhubungan dengan ukuran font pada elemen yang bersangkutan
https://developer.mozilla.org/en-US/docs/Web/CSS/absolute-size

`pt`, `px`

untuk membuat website disarankan menggunakan satuan relative.

# Mengenal selector dan cara kerjanya
Selector adalah cara untuk memilih elemen html yang akan diberikan style
## Selector menggunakan elemen html
https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors
```css
* {
    background-color: white;
}

h1, h2, h3 {
    color: blue;
}

p {
    color: green;
    font-size: 16px;
}
```

## Selector menggunakan atribut ID
https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors

`id` ,merupakan atribut yang digunakan untuk mengidentifikasi elemen html yang unique
artinya hanya boleh ada satu elemen html yang memiliki atribut id yang sama`
untuk memilih elemen dengan atribut ID gunakan tanda pagar `#`
```html
<style>
    #judul {
        color: red;
    }
</style>

<h1 id="judul">Hello World</h1>
```

## Selector menggunakan atribut CLASS
`class`,merupakan atribut yang digunakan untuk mengelompokkan elemen html yang memiliki style yang sama
artinya boleh ada beberapa elemen html yang memiliki atribut class yang sama
untuk memilih elemen dengan atribut class gunakan tanda titik `.`
```html
<style>
    .hitam {
        color: black;
    }

    #judul {
        font-size: 24px;
    }
</style>

<h1 id="judul" class="hitam">Hello World</h1>
<h2 class="hitam">Hello World</h2>
```

## Descendant selector
merupakan selector untuk memilih elemen html yang ada di dalam elemen lain

contoh memilih elemen `li` yang didalamnya ada elemen `a`
```html
<style>
    li a {
        color: red;
    }
</style>

<ul>
    <li><a href="#">Link 1</a></li>
    <li><a href="#">Link 2</a></li>
    <li><a href="#">Link 3</a></li>
</ul>
```

## Direct Descendant Selector
merupakan selector untuk memilih langsung elemen html dalam elemen lain,selain itu akan diabaikan meskipun elemen tersebut ada di dalam elemen yang sama
```html
<style>
    .jokes > p {
        color: red;
    }
</style>

<div class="jokes">
    <p>Jokes 1</p> <!-- akan terselect-->
    <p>Jokes 2</p> <!-- akan terselect-->
    <div>
        <p>Jokes 3</p>  <!-- tidak terselect-->
    </div>
</div>
```

elmen paragraf jokes 3 tidak terpilih karena tidak dibawah langsung dari class `jokes`

## Ajdacent Selector
adalah selector untuk memilih elemen html yang berada setelah elemen lain
```html
<style>

    a + p {
        color: red;
    }
</style>

<div class="jokes">
    <p>Jokes 1</p> <!-- tidak terselect-->
    <p>Jokes 2</p> <!-- tidak terselect-->
    <a href="#">Link 1</a>
    <p>Jokes 3</p> <!-- terselect-->
</div>

elemen yang terpilih hanyalah paragraf jokes 3 , karena berada setelah elemen a'
```

## Mengenal atribut selector
https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors

atribut selector,merupakan selector untuk memilih elemen html yang memiliki atribut tertentu

contoh memilih elemen `a` yang memiliki atribut `href` dengan nilai `https://www.google.com`
```html
<style>
    a[href="https://www.google.com"] {
        color: red;
    }
    
    input[type="text"] {
        background-color: red;
    }
</style>

<a href="https://www.google.com">Link 1</a> <!-- terselect -->
<a href="https://www.yahoo.com">Link 2</a> <!-- tidak terselect-->
<input type="text"></input> <!-- terselect -->
```

## Mengenal Pseudo Class
https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes

pseudo class,merupakan selector untuk memilih elemen html yang memiliki state tertentu yang sudah ada pada DOM,diantaranya :
```
:active
:hover
:focus
:checked
:disabled
:enabled
:required
:optional
:valid
:invalid
:target
```

```html
<style>
    a:hover {
        color: red;
    }
</style>

<a href="https://www.google.com">Link 1</a>
<a href="https://www.yahoo.com">Link 2</a> 
<input type="text"></input>
```
maka setiap link yang di hover akan berubah menjadi warna merah

`nth-of-type(2n)` untuk seleksi elemen yang genap,biasanya digunakan untuk saling silang warna
```html
<style>
    p:nth-of-type(2n) {
        color: red;
    }
</style>

<p>Paragraf 1</p>
<p>Paragraf 2</p>
<p>Paragraf 3</p>
<p>Paragraf 4</p>
```
maka hanya paragraf 2 dan 4 yang akan berubah menjadi warna merah

## Mengenal Pseudo Element
https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements

Membuat elemen virtual yang tidak ada di DOM, tapi bisa diberi style seolah-olah elemen tersebut ada, biasanya untuk men-style bagian tertentu dari elemen.
```
::first-letter
::first-line
::before
::after
```

membuat huruf pertama dari paragraf menjadi besar
```html
<style>
    p::first-letter {
        font-size: xx-large;
    }
</style>

<p>Huruf ini menjadi besar</p>
```

# Box model Mengubah ukuran element dengan CSS
## Mengenal bagian box model pada element
![alt text](image.png)

- Margin adalah ruang di luar elemen
- Padding adalah ruang di dalam elemen
- Border adalah garis yang memisahkan elemen
- Content adalah isi dari elemen
```html
<style>
    div {
        width: 100px;
        height: 100px;
        border: 1px solid black;
        padding: 10px;
        margin: 10px;
    }
</style>

<div>
    <p>Paragraf 1</p>
</div>
```

## Mengenal properti border pada css
https://developer.mozilla.org/en-US/docs/Web/CSS/border

```html
<style>
    div {
        border: thick double #32a1ce;
    }
</style>

<div> 
    <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, quae.</p>
</div>
```

## Mengenal properti paddding pada css
https://developer.mozilla.org/en-US/docs/Web/CSS/padding

padding adalah ruang didalam elemen,jarak antara content dan border

```html
<style>
    div {
        padding: 10px 50px 20px;
    }
</style>

<div>
    <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, quae.</p>
</div>
```

## Mengenal properti margin pada css
https://developer.mozilla.org/en-US/docs/Web/CSS/margin

 margin adalah ruang di luar elemen,jarak antara elemen satu dan elemen lain

```html
<style>
    div {
        margin: 10px 50px 20px;
    }
</style>

<div>
    <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, quae.</p>
</div>

<div>
    <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, quae.</p>
</div>
```

## Mengenal properti display
https://developer.mozilla.org/en-US/docs/Web/CSS/display
![alt text](image-1.png)

### display inline 
Hanya menempati ruang yang dibutuhkan oleh kontennya dan tidak memulai baris baru. Tidak dapat diatur lebarnya atau tingginya. 
```html
<p> {
    display: inline;
}
```
macam element yang menggunakan display inline adalah :
```<a>, <span>, <img>, <strong>, <em>, <b>, dan <br>```

### display block 
Memulai baris baru dan menempati seluruh lebar yang tersedia. Lebar, tinggi, margin, dan padding dapat diatur
```html
<div> {
    display: block;
    width: 100px;
    height: 100px;
    }
```
macam element yang menggunakan display block adalah :
``<p> (paragraf), <div>, <h1> hingga <h6> (heading), <form>, <ol>, <ul>, dan <li>. ``


### display inline-block 
Perilakunya seperti elemen inline, tetapi dapat diatur lebarnya, tingginya, margin, dan padding-nya (seperti elemen block). 

```html
<div> {
    display: inline-block;
    width: 100px;
    height: 100px;
    }
```

### display none 
adalah display yang tidak menampilkan atau menyembunyikan elemen tersebut.
```html
<div> {
    display: none;
    }
```

# Flexbox dasar
## Apa itu flexbox?
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox
![alt text](image-2.png)
Flexbox adalah model layout yang digunakan untuk mengatur posisi dan ukuran elemen dalam container. Flexbox memungkinkan kita untuk membuat layout yang responsif dan mudah diatur.

```html
<style>
    h1 {
    text-align: center;
}
/* Membuat container flex sebagai wadah */
#container {
    background-color: #08344b;
    width: 90%;
    height: 500px;
    margin: 0 auto;
    border: 5px solid #003049;
    display: flex;
    flex-direction: column;
}

/* membuat elemen flex */
#container div {
    width: 200px;
    height: 200px;
}
</style>

<section id="container">
    <div style="background-color: #00b4d8;">1</div>
    <div style="background-color: #20a3bd;">2</div>
    <div style="background-color: #135f6e;">3</div>
    <div style="background-color: #104651;">4</div>
    <div style="background-color: #063f4a;">5</div>
</section>
```
`#container` berfungsi sebagai wadah yang memiliki display flex,  `container div` adalah elemen flex yang di dalamnya.lebar dari elelem didalamnya akan mengikuti lebar dari container atau parentnya

## Mengatur urutan element dengan Flex Direction
https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction

![alt text](image-3.png)

jenis urutan element flexbox ada 4 jenis :

1. row (default)
2. row-reverse
3. column
4. column-reverse

yang membedakan adalah urutan dimulainya apakah dari kiri,kanan,atas, atau bawah
```html
<style>
#container {
    background-color: #08344b;
    width: 90%;
    height: 500px;
    margin: 0 auto;
    border: 5px solid #003049;
    display: flex;
    flex-direction: column; /** urutan element flexbox */
}
</style>
```

## Membagi Rata Jarak Horizontal Dengan `Justify Content`
https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content

![alt text](image-4.png)

```html
<style>
#container {
    background-color: #08344b;
    width: 90%;
    height: 500px;
    margin: 0 auto;
    border: 5px solid #003049;
    display: flex;
    flex-direction: column; /** urutan element flexbox */
    justify-content: center; /** membagi rata jarak horizontal */
}
</style>
```

jenis justify content ada 5 jenis :
1. flex-start
2. flex-end
3. center
4. space-between
5. space-around

## `flex-wrap` Menampilkan Element Dengan Ukuran Sebenaranya Pada Flex
https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap

adalah properti untuk menampilkan ukuran sebenarnya dari isi flexbox,dia akan mempertahankan ukuran sebenarnya sampai memenuhi luas dari container

jenis flex-wrap :
1. nowrap (default)
2. wrap
3. wrap-reverse

```html
<style>
#container {
    background-color: #08344b;
    width: 90%;
    height: 500px;
    margin: 0 auto;
    border: 5px solid #003049;
    display: flex;
    flex-direction: column; /** urutan element flexbox */
    justify-content: center; /** membagi rata jarak horizontal */
    flex-wrap: wrap; /** menampilkan ukuran sebenarnya dari isi flexbox */
}

#container div {
    width: 200px;
    height: 200px;
}
</style>

<html>
    <body>
        <div id="container">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
        </div>
    </body>
</html>
```

## Membagi jarak Vertikal Dengan Align Item
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container

![alt text](image-5.png)

jenis align item ada 5 jenis :
1. flex-start
2. flex-end
3. center
4. space-between
5. space-around

```html
<style>
h1 {
    text-align: center;
}

#container {
    background-color: #08344b;
    width: 90%;
    height: 500px;
    margin: 0 auto;
    border: 5px solid #003049;
    display: flex;
    flex-direction: row;
    /* flex-wrap: wrap; */
    justify-content: center;
    align-items: flex-start; /** membagi rata jarak vertikal */
}

#container div {
    width: 200px;
    height: 200px;
}

</style>


<section id="container">
    <div style="background-color: #00b4d8;">1</div>
    <div style="background-color: #20a3bd; height: 400px;">2</div>
    <div style="background-color: #135f6e;">3</div>
    <div style="background-color: #104651;">4</div>
    <div style="background-color: #063f4a;">5</div>
</section>
```

## Membagi Jarak Vertikal Dengan Align Content
https://developer.mozilla.org/en-US/docs/Web/CSS/align-content

![alt text](image-6.png)

`align-content :` berfungsi seolah memberi space diantara elemen,dan hanya akan aktif jika mengaktfikan `wrap`

jenis align content ada 5 jenis :
1. flex-start
2. flex-end
3. center
4. space-between
5. 5. space-around

```css
h1 {
    text-align: center;
}

#container {
    background-color: #08344b;
    width: 90%;
    height: 500px;
    margin: 0 auto;
    border: 5px solid #003049;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /**harus mengaktifkan wrap agar ada perubahan */
    justify-content: center;
    align-items: flex-start;
    align-content: flex-end; /** membagi jarak dengan align content */
}

#container div {
    width: 200px;
    height: 200px;
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Belajar CSS</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Flexbox</h1>
<section id="container">
    <div style="background-color: #00b4d8;">1</div>
    <div style="background-color: #20a3bd; height: 400px;">2</div>
    <div style="background-color: #135f6e;">3</div>
    <div style="background-color: #104651;">4</div>
    <div style="background-color: #063f4a;">5</div>
</section>
</body>
</html>
```

## Mengatur Jarak dengan Align Self
![alt text](image-7.png)

`align-self` adalah properti untuk mengatur jarak vertikal pada element individual

```css
    h1 {
        text-align: center;
    }

    #container {
        background-color: #08344b;
        width: 90%;
        height: 500px;
        margin: 0 auto;
        border: 5px solid #003049;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        /* align-content: flex-end; */

    }

    #container div {
        width: 200px;
        height: 200px;
    }

    #container div:nth-of-type(1) {
        align-self: flex-start;
    }
    #container div:nth-of-type(2) {
        align-self: center;
    }
    #container div:nth-of-type(3) {
        align-self: flex-end;
    }
    #container div:nth-of-type(4) {
        align-self: center;
    }
    #container div:nth-of-type(5) {
        align-self: flex-start;
    }
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Belajar CSS</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Flexbox</h1>
<section id="container">
    <div style="background-color: #00b4d8;">1</div>
    <div style="background-color: #20a3bd;">2</div>
    <div style="background-color: #135f6e;">3</div>
    <div style="background-color: #104651;">4</div>
    <div style="background-color: #063f4a;">5</div>
</section>
</body>
</html>
```
![alt text](image-8.png)

## Mengubah ukuran Element Flex
Flex sizing properties 
- Flex basis
adalah properti CSS dalam flexbox yang menentukan ukuran awal dari elemen flex item sebelum ruang yang tersedia didistribusikan di antara mereka
```html
<style>
h1 {
        text-align: center;
    }

    #container {
        background-color: #08344b;
        width: 90%;
        /* height: 500px; */
        margin: 0 auto;
        border: 5px solid #003049;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
        /* align-content: flex-end; */

    }

    #container div {
        width: 200px;
        height: 200px; 
        flex-basis: 500px; /* mengatur ukuran element flex basis */
    }
</style>

<body>
    <h1>Flexbox</h1>
<section id="container">
    <div style="background-color: #00b4d8;">1</div>
    <div style="background-color: #20a3bd;">2</div>
    <div style="background-color: #135f6e;">3</div>
    <div style="background-color: #104651;">4</div>
    <div style="background-color: #063f4a;">5</div>
</section>
</body>
```
![alt text](image-9.png)

- Flex grow
adalah properti CSS untuk mengatur jumlah space element yang tersedia pada pembungkusnya
```html
<style>
h1 {
        text-align: center;
    }

    #container {
        background-color: #08344b;
        width: 90%;
        /* height: 500px; */
        margin: 0 auto;
        border: 5px solid #003049;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        /* align-content: flex-end; */

    }

    #container div {
        width: 200px;
        height: 200px;
    }

    #container div:nth-of-type(1) {
        flex-grow: 1;  /** mengatur jumlah space element yang tersedia pada pembungkusnya */
    }
</style>

<body>
    <h1>Flexbox</h1>
<section id="container">
    <div style="background-color: #00b4d8;">1</div>
    <div style="background-color: #20a3bd;">2</div>
    <div style="background-color: #135f6e;">3</div>
    <div style="background-color: #104651;">4</div>
    <div style="background-color: #063f4a;">5</div>
</section>
</body>
```

![alt text](image-10.png)
- Flex shrink
adalah properti CSS yang berfungsi jika element lebih besar dari containernya maka mereka akan mengecil sesuai dengan nilai yang diberikan pada flex-shrink

```html
<style>
    h1 {
        text-align: center;
    }

    #container {
        background-color: #08344b;
        width: 90%;
        /* height: 500px; */
        margin: 0 auto;
        border: 5px solid #003049;
        display: flex;
        /* flex-wrap: wrap; */
        flex-direction: row;
        justify-content: center;
        align-items: center;
        /* align-content: flex-end; */

    }

    #container div {
        width: 200px;
        height: 200px;
        flex-basis: 400px;
    }

    #container div:nth-of-type(1) {
        flex-shrink: 2; /** membuat element ke 1 akan mengecil ketika container di resize */
    }

        #container div:nth-of-type(5) { /** membuat element ke 5 akan mengecil ketika container di resize    */
        flex-shrink: 2;
    }
</style>

<body>
    <h1>Flexbox</h1>
<section id="container">
    <div style="background-color: #00b4d8;">1</div>
    <div style="background-color: #20a3bd;">2</div>
    <div style="background-color: #135f6e;">3</div>
    <div style="background-color: #104651;">4</div>
    <div style="background-color: #063f4a;">5</div>
</section>
</body
```
![alt text](image-11.png)

## Shorthand flex
https://developer.mozilla.org/en-US/docs/Web/CSS/flex#syntax

berguna untuk mempersingkat kode dalam penerapan flex

``flex-grow | flex-shrink | flex-basis``

```html
<style>
main {
    width: 80%;
    margin: 0 auto;
    border : 5px solid black;
    height: 500px;
    display: flex;
}

main .sidebar {
    background-color: #003049;
    flex : 1 2 300px; /* flex-grow flex-shrink flex-basis */
}

main .content {
    background-color: #0077b6;
    flex : 2 1 800px; /* flex-grow flex-shrink flex-basis */
}   
</style>

<h1>Flexbox</h1>
<section id="container">
    <div style="background-color: #00b4d8;">1</div>
    <div style="background-color: #20a3bd;">2</div>
    <div style="background-color: #135f6e;">3</div>
    <div style="background-color: #104651;">4</div>
    <div style="background-color: #063f4a;">5</div>
</section>

<h1>Layout example</h1>
<main>
    <section class="sidebar"></section>
    <section class="content"></section>
    <section class="sidebar"></section>
</main>
```
![alt text](image-12.png)

## Pengetahuan responsive design
adalah desain web yang dapat disesuaikan dengan berbagai ukuran layar dan perangkat,sehingga dulu ketika mengakses website dengan perangkat berbeda harus diarahkan ke url contoh m.facebook.com sekarang sudah tidak karena memanfaatkan responsive design yaitu dengan `media query`

## Memulai kehebatan query
dengan mengatur minimal ukuran layar yang didukung oleh browser kita bisa memberi properti yang berbeda sesuai ukuran layar

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Belajar CSS</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <a href="#home">Home</a>
        <ul>
            <li><a href="#profile">Profile</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="#register">Register</a>
    </nav>
    <h1>Media Query</h1>
</body>
</html>
```
```css
body {
    font-family: 'Calibri', 'sans-serif';
}

h1 {
    font-size : 6em;
    text-align: center;
    color: red;
}

nav {
    font-size: 1.5em;
}

ul, li {
    display: inline;
    margin: 0;
    padding: 0;
}

/* ketika lebar layar minimal 400px */
@media screen and (min-width: 400px) {
    h1 {
        font-size: 4em;
        color: rgb(91, 36, 36);
    }
}

/* ketika lebar layar minimal 700px */
@media screen and (min-width: 700px) {
    h1 {
        font-size: 6em;
        color: rgb(11, 155, 124);
    }
}

/* ketika lebar layar minimal 800px dan maximal 1200px */
@media screen and (min-width: 800px) and (max-width: 1200px) {
    h1 {
        font-size: 8em;
        color: rgb(144, 129, 31);
    }
}

/* ketika orientasi layar adalah landscape */
@media screen and (orientation: landscape) {
    h1 {
        background-color: darkgrey;
    }
}
```

## Referensi breakpoint media query
Using min-width
```
// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) { ... }

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) { ... }

// Large devices (desktops, 992px and up)
@media (min-width: 992px) { ... }

// Extra large devices (large desktops, 1200px and up)
@media (min-width: 1200px) { ... }
```

using max-widht
```
Using max-width

@media (max-width: 575.98px) { ... }

// Small devices (landscape phones, less than 768px)
@media (max-width: 767.98px) { ... }

// Medium devices (tablets, less than 992px)
@media (max-width: 991.98px) { ... }

// Large devices (desktops, less than 1200px)
@media (max-width: 1199.98px) { ... }
```

## Membuat Responsive Navigation
bertujuan untuk mengubah navigasi agar dapat diakses pada perangkat mobile,dengan menyesuaikan lebar dan perataan pada element

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Belajar CSS</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <a href="#home">Home</a>
        <ul>
            <li><a href="#profile">Profile</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="#register">Register</a>
    </nav>
    <h1>Media Query</h1>
</body>
</html>
```

```css
body {
    font-family: 'Calibri', 'sans-serif';
}

h1 {
    font-size : 6em;
    text-align: center;
    color: red;
}

nav {
    font-size: 1.5em;
    display: flex;
    justify-content: space-between; /* agar nav memiliki space di tengah*/
}

ul {
    border: 1px solid red;
    flex: 1;
    max-width: 50%;
    justify-content: space-evenly; /* agar ul memilik space diantara item */
}


ul, 
li {
    display: flex;
    margin: 0;
    padding: 0;
}

/* ketika display dibawah 768px ubah nav menjadi column */
@media (max-width: 768px) {
    h1 {
        font-size: 4em;
    }
    nav {
        flex-direction: column;
        align-items: center; /* agar nav menjadi center */
    }
    nav ul {
        flex-direction: column;
    }
}
```
Pada ukuran diatas 768

![alt text](image-13.png)

Pada ukuran dibawah 768

![alt text](image-14.png)

# Studi kasus membuat tabel pricing
index.html
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Price Tiers</title>
		<!-- <link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /> -->
		<link
			href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap"
			rel="stylesheet"
		/>
		<link rel="stylesheet" href="app.css" />
	</head>
	<body>
		<div class="panel">
			<div class="pricing-plan">
				<img src="icons/icon1.png" alt="" class="pricing-img" />
				<h2 class="pricing-header">Personal</h2>
				<ul class="pricing-features">
					<li class="pricing-features-item">Custom domains</li>
					<li class="pricing-features-item">
						Sleeps after 30 mins of inactivity
					</li>
				</ul>
				<span class="pricing-price">Free</span>
				<a href="#/" class="pricing-button">Sign up</a>
			</div>

			<div class="pricing-plan">
				<img src="icons/icon2.png" alt="" class="pricing-img" />
				<h2 class="pricing-header">Small team</h2>
				<ul class="pricing-features">
					<li class="pricing-features-item">Never sleeps</li>
					<li class="pricing-features-item">
						Multiple workers for more powerful apps
					</li>
				</ul>
				<span class="pricing-price">$150</span>
				<a href="#/" class="pricing-button is-featured">Free trial</a>
			</div>

			<div class="pricing-plan">
				<img src="icons/icon3.png" alt="" class="pricing-img" />
				<h2 class="pricing-header">Enterprise</h2>
				<ul class="pricing-features">
					<li class="pricing-features-item">Dedicated</li>
					<li class="pricing-features-item">Simple horizontal scalability</li>
				</ul>
				<span class="pricing-price">$400</span>
				<a href="#/" class="pricing-button">Free trial</a>
			</div>
		</div>
	</body>
</html>
```

app.css
```css
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
	display: block;
}
body {
	line-height: 1;
}
ol,
ul {
	list-style: none;
}
blockquote,
q {
	quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

html {
	box-sizing: border-box;
	font-family: 'Open Sans', sans-serif;
}


/* bagian body sebagai parent utama */
body {
	background-color: #60a9ff; /*mengubah background body menjadi biru*/
	display: flex; /* mengubah tampilan body menjadi flex */
	justify-content: center; /*membuat rata tengah*/
	align-items: center;
	min-height: 100vh;
}

/* bagian panel */
.panel {
	background-color: white;
	border-radius: 20px;  /*membuat rounded corner*/
	padding: 15px 25px; /*memberi padding atas bawah 15px dan kanan kiri 25px*/
	width: 100%; /*membuat panel lebar 100%*/
	max-width: 960px; /* tampilan panel hanya maksimal 960px*/
	display: flex;
	flex-direction: column; /* mengubah tampilan panel menjadi column */
	text-align: center; /*membuat rata tengah */
	text-transform: uppercase; /*membuat semua huruf kapital*/
	-webkit-border-radius: 20px;
	-moz-border-radius: 20px;
	-ms-border-radius: 20px;
	-o-border-radius: 20px;
}

.pricing-plan {
	border-bottom: 1px solid #e1f1ff;
}

.pricing-plan:last-child {
	border-bottom: none;
}

.pricing-img {
	margin-bottom: 25px;
	max-width: 100%;
}

.pricing-header {
	color: #888;
	font-weight: 600;
	letter-spacing: 1px; /*jarak antar huruf 1px*/
}

.pricing-features {
	margin: 50px 0 25px; /*50px pading atas , 0 padding bawah , 25px kanan kiri*/
	color: #015ff9;
}

.pricing-features-item {
	font-weight: 600;
	letter-spacing: 1px; /*jarak antar huruf */
	font-size: 12px;
	line-height: 1.5; /* jarak antar paragraf*/
	padding: 15px 0;  /*15 pading atas bawah, 0 padding kanan kiri */
	border-top: solid 1px #e1f1ff; 
}

.pricing-features-item:last-child { /*membuat border bawah pada item last child*/
	border-bottom: solid 1px #e1f1ff;
}

.pricing-price {
	color: #016ff9;
	display: block;
	font-size: 32px;
	font-weight: 700;
}

/* Mengubah bagian tombol */
.pricing-button {
	border: 1px solid #9dd1ff;
	border-radius: 10px; /*membuat rounded corner*/
	color: #348efe;
	display: inline-block;
	padding: 15px 35px; /*15px padding atas bawah, 35px kanan kiri */ 
	text-decoration: none; /* menghilangkan garis bawah link */
	margin: 25px 0;
}

/* mengubah warna background button ketika di hover */
.pricing-button:hover,
.pricing-button:focus {
	background-color: #e1f1ff;
}

/* mengubah warna background button featured */
.pricing-button.is-featured {
	background-color: #48aaff;
	color: white;
}

/* mengubah warna background button ketika di hover */
.pricing-button.is-featured:hover,
.pricing-button.is-featured:focus {
	background-color: #269aff;
	color: white;
}

/* mengubah tampilan panel ketika ukuran layar 900px */
@media (min-width: 900px) {
	.panel {
		flex-direction: row; /* mengubah tampilan panel menjadi row */
	}
	.pricing-plan {
		border-bottom: none; /* menghilangkan border bawah */
		border-right: 1px solid #e1f1ff; /* menambahkan border kanan */
		padding: 25px 50px; /* 25px padding atas bawah, 50px padding kanan kiri */
	}
	.pricing-plan:last-child { /* menghilangkan border kanan pada item last child */
		border-right: none;
	}
}
```

![alt text](image-15.png)