import { Entity, Column, ObjectId, ObjectIdColumn } from "typeorm"
​
@Entity()
export class Product {
    @ObjectIdColumn()
    id: ObjectId
​
    @Column({ unique: true })
    admin_id: number

    @Column()
    name: string

    @Column()
    image: string
​
    @Column({ default: 0 })
    likes: number
}