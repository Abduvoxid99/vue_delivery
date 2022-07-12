<template>
  <a-spin size="large" :spinning="guideLoad">
    <a-card>
      <a-row>
        <a-col v-for="guide in allGuide" :key="guide.id" :span="6" style="padding: 10px 10px" v-if="guide.instructions && guide.instructions.length">
          <a-card hoverable style="width: 100%" :title="guide.title.uz">
<!--            <img-->
<!--              width="100%"-->
<!--              height="150px"-->
<!--              style="object-fit: cover"-->
<!--              slot="cover"-->
<!--              alt="example"-->
<!--              src="https://avatarfiles.alphacoders.com/145/thumb-1920-145024.jpg"-->
<!--            />-->
            <p class="ins" v-for="ins in guide.instructions" :key="ins.id" @click="$router.push({ name: 'Instruction', params: { guid: guide.id, insid: ins.id }, query: { guid: guide.title.uz, name: ins.title.uz } })"> {{ ins.title.uz }} </p>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </a-spin>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  methods: {
    ...mapActions(['getGuide'])
  },
  computed: {
    ...mapGetters(['allGuide', 'guideLoad'])
  },
  mounted () {
    this.getGuide()
  }
}
</script>

<style>
.ins {
  padding: 5px 5px 5px 10px;
  margin-left: 10px;
  border-radius: 10px;
  transition: all .5s;
}
.ins:hover {
  margin-left: 10px;
  background-color: #9de6ea;
  border-radius: 10px;
  border: none;
  padding: 5px 5px 5px 50px;
}
</style>
