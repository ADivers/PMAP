describe(  'a sanity check', function(){
  it(  'should be true', function(){
    expect(  true  ).toBe(  true  );
  });

  it(  'should be false', function(){
    expect(  false  ).not.toBe(  true  );
  });

  it(  'should equal 12', function(){
    var a = 6, b = a;
    expect(  a * b ).toEqual(  36  );
  })
});
