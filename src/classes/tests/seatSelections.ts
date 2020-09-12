import SeatSelections from "../seatSelections";

test('Seat Selections Class Works', () => {
    const test = new SeatSelections();
    test.add("1", [1,2,3], 1);
    expect(test.selections["1"]).toStrictEqual({
        tableId: "1",
        seatIdList: [1,2,3],
        chooseNumber: 1,
    });

    test.add("1", [1,2,3], 1);
    expect(test.selections["1"]).toStrictEqual({
        tableId: "1",
        seatIdList: [1,2,3],
        chooseNumber: 2,
    });

    test.add("2", [2,3,5], 3);
    expect(test.selections).toStrictEqual({
        "1": {
            tableId: "1",
            seatIdList: [1,2,3],
            chooseNumber: 2,
        },
        "2": {
            tableId: "2",
            seatIdList: [2,3,5],
            chooseNumber: 3,
        }
    });
});