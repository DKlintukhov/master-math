/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


#ifndef EXPRESSION_H
#define EXPRESSION_H

#include "Operand.h"
#include "Answer.h"

namespace MasterMath
{
    enum class Operator
    {
        Add,
        Sub,
        Div,
        Mul
    };

    template <class Answer>
    class IExpression
    {
    public:
        virtual bool CheckAnswer(Answer answer) const noexcept = 0;
        virtual Answer GetAnswer() const noexcept = 0;
        virtual void Solve() noexcept(false) = 0;
        virtual ~IExpression() = default;
    };

    class SimpleExpression : public IExpression<SimpleExpressionAnswer>
    {
    public:
        SimpleExpression(Constant a, Constant b, Operator op);

        bool CheckAnswer(SimpleExpressionAnswer answer) const noexcept override;
        void Solve() noexcept(false) override;
        SimpleExpressionAnswer GetAnswer() const noexcept override;

    private:
        Constant m_a;
        Constant m_b;
        Operator m_op;
        SimpleExpressionAnswer m_answer;
    };
}


#endif 
