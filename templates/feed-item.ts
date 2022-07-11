export default `
<div>
  {{#if coverImage}}
    <img src="{{coverImage}}" alt="{{title}}" />
  {{/if}}

  {{#if excerpt}}
    <p>{{excerpt}}</p>
  {{/if}}

  <p>
    Click <a href="{{readURL}}">here</a> to read the full post.
  </p>
</div>
`
