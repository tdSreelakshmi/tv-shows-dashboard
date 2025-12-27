<template>
  <div v-if="person" class="person-info flex-col">
    <div class="flex-row">
      <img
        v-if="person?.image?.['medium']"
        :src="person?.image['medium']"
        alt=""
      />
      {{ person?.name }}
      {{ person?.country?.name }}
      {{ person?.gender }}
      {{ person?.birthday }}
    </div>

    <div>
      <div v-for="(credit, idx) in person._embedded.castcredits" :key="idx">
        <img :src="credit.image" alt="img" />
        <p>{{ credit._links.show.name }}</p>

        <p>{{ credit._links.character.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ShowCard from '../ShowCard.vue'
export default {
  components: { ShowCard },
  props: {
    id: Number
  },
  data () {
    return {
      person: null
    }
  },
  created () {
    this.getCastCredits()
  },
  methods: {
    async getCastCredits () {
      try {
        this.person = await this.$store.dispatch('getCastCredits', this.id)
        this.getCharacters()
        console.log(this.person)
      } catch (error) {}
    },
    async getCharacters () {
      if (!this.person) return
      const castcredits = this.person._embedded.castcredits
      for (let index = 0; index < castcredits.length; index++) {
        const element = castcredits[index]._links.character.href
        const characterId = element.split('/')[4]
        try {
          const image = await this.$store.dispatch('getCastInfo', characterId)
          if (image) {
            this.person._embedded.castcredits[index].image = image
          }
        } catch (error) {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.person-info {
  position: fixed;
  background: white;
  height: 90vh;
  width: 90vw;
  inset: 0;
  margin: auto;
  border-radius: 20px;
  overflow: auto;
}
img {
  height: 50px;
}
</style>
