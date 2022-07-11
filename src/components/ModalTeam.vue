<script>
  export default {
    name: 'ModalMember',
    methods: {
      close() {
        this.$emit('close');
      },
    },
    props:['memberSelect']
  };
</script>

<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal-member" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
        <button type="button" class="btn-close btn-close-modal-rewards" @click="close" aria-label="Close modal">
            <i class="fas fa-times icon-close-modal-troop"></i>
        </button>
        <div class="div-content-modal">
            <div class="modal-box">
                <div class="modal-box-left">
                    <img class="modal-img" :src="memberSelect.imageURL" alt="" >
                </div>
                <div class="modal-box-rigth">
                    <div class="modal-name">{{memberSelect.name}}</div>
                    <div class="modal-role">{{memberSelect.role}}</div>
                    <div class="modal-description"> {{memberSelect.description}}</div>
                    <a :href="memberSelect.social" class="modal-social" target="_blank"> {{memberSelect.social}}</a>
                </div>
            </div>
        </div>
      </div>
    </div>
  </transition>
</template>