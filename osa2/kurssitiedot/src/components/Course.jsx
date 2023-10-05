const Course = ({course}) => {
    return (
        <div>
            {Header(course)}
            {Content(course)}
            {Total(course)}
        </div>
    )
}

const Header = (course) => {
    return (
        <h2> {course.name} </h2>
    )
}
const Content = (course) => {
    const Part = (props) => {
        return (
            <p>
                {props.part} {props.exercises}
            </p>
        )
    }
    return (
        <div>
            {course.parts.map(part =>
                <Part key={part.id} part={part.name} exercises={part.exercises} />
            )}
        </div>
    )
}

const Total = (course) => {
    const number = course.parts.reduce((result, item) => {
        return result + item.exercises
    }, 0)

    return (
        <h3>
            total of {number} exercises
        </h3>
    )
}
export default Course