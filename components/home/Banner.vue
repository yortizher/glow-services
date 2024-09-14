<template>
  <div class="banner-content">
    <div class="banner  mx-auto">
      <div class="slogan">
        <h1 class="gradient-text">Espacios relucientes para tu éxito personal y profesional</h1>
        <p class="sub-text">Conectamos limpieza y tecnología. Transforma tu hogar y oficina en espacios
          impecables. Ahorra tiempo y reduce estrés.</p>
      </div>

      <img src="../../public/retrato2.1.png" alt="Logo" class="banner-img d-none d-md-flex"></img>
    </div>
  </div>
</template>

<style lang="scss">
.banner-content {
  background-color: #1237a9;
  // border-radius: 20px;
}
.banner {
  width: 100%;
  height: 427px;
  position: relative;
  // width: 90%;
}

.slogan {
  z-index: 1;
  position: absolute;
  top: 20%;
  left: 5%;
  width: 50vw;
  font-family: 'Montserrat-Black';
  line-height: normal;
  cursor: pointer;

  .gradient-text {
    font-size: 45px;
    font-weight: bold;
    background: linear-gradient(to right, #0ab5e1, #1ed5b9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sub-text {
    font-size: 16px;
    color: #ffffff;
    margin-top: 20px;
    font-family: 'Montserrat-Medium';
  }
}

.banner-img {
  position: absolute;
  right: 40px;
  top: 52%;
  transform: translateY(-50%);
  width: 500px;
  height: 410px;
  -o-object-fit: contain;
  object-fit: cover;
}
@media screen and (max-width: 959px) {
  .slogan {
  z-index: 1;
  position: absolute;
  top: 10%;
  left: 0%;
  width: 100vw;
  font-family: 'Montserrat-Black';
  line-height: normal;
  cursor: pointer;
  text-align: center;

  .gradient-text {
    font-size: 45px;
    font-weight: bold;
    background: linear-gradient(to right, #0ab5e1, #1ed5b9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sub-text {
    font-size: 16px;
    color: #ffffff;
    margin-top: 20px;
    font-family: 'Montserrat-Medium';
    padding-left: 2%;
    padding-right: 2%;
  }
}
}
</style>