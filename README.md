# Vanila-Web-Nestable-Component
중첩가능한 커스텀 웹 컴포넌트를 바닐라로 구현

Component Class를 상속받아 구현

## 컴포넌트 구현
```
class MyComponent extends Component {
    // 컴포넌트의 UI, 필수
    // 인자는 컴포넌트의 데이터, 프롭, 자식 컴포넌트(string 타입)
    template(data, props, child) {
        const { count } = data;
        const { message } = props;

        // UI를 반환
        return `
            Component
            <br>
            ${ child ? `Child: <div style="border: 5px solid aqua">
                ${ child }
            </div>` : `` }
            <p> message: ${ message } </p>
            <h1>클릭 ${count}번</h1>
            <button class="click">클릭하기</button>
        `;
    }

    // 데이터의 초기 값을 설정, 필수
    // 반드시 함수로 구현
    data() {
        return {
            count: 0
        };
    }

    // 컴포넌트 생성시 실행되는 함수
    // 필수는 아님
    onCreated() {
        // 컴포넌트에 이벤트를 추가하는 함수
        this.addEvent('.click', 'click', e => {
            // 데이터를 변경하는 함수, 직접 변경 불가
            this.updateData(data => {
                return {
                    count: data.count + 1
                }
            });
        });
    }
}
```

## 컴포넌트 사용법
```
new ㅁ직접 구현한 컴포넌트ㅁ(
    // 부모 Element (없다면 null)
    document.querySelector("#app"),
    // 프롭
    {
        message: '안녕하세요1'
    },
    // 자식 컴포넌트 (없다면 null)
    new MyComponent(
        document.querySelector("#app"),
        {
            message: '안녕하세요6'
        },
        null
    )
```
